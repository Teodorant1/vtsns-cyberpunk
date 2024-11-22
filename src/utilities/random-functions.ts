/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sql } from "drizzle-orm";
import got from "got";
import { load } from "cheerio";
import { type PostData } from "~/project-types";
import { db } from "~/server/db";
import { article, jobRuns, subject } from "~/server/db/schema";

export async function scrape_Predmeti_info() {
  const { body } = await got("https://vtsns.edu.rs/predmeti-info/");
  const $ = load(body);

  const postPromises: Promise<PostData>[] = [];

  $(".post-excerpt").each((index, element) => {
    const timeElement = $(element).find("time");
    const titleElement = $(element).find("h2.entry-title a");

    const datetime = timeElement.attr("datetime") ?? "";
    const title = titleElement.text().trim() ?? "";
    const href = titleElement.attr("href") ?? "";

    const date = datetime ? new Date(datetime) : null;
    const href_title_date = `${title}${href}${date?.toDateString()}`;
    const title_analysis = break_title_into_data(title);

    postPromises.push(
      scrape_vtsns_article(href).then((articleData) => ({
        date,
        title,
        href,
        title_analysis,
        href_title_date,
        article: articleData,
      })),
    );
  });

  const postsDataResolved = await Promise.all(postPromises);
  return postsDataResolved;
}

export async function scrape_vtsns_article(url: string) {
  const { body } = await got(url);
  const $ = load(body);

  const paragraphText = $(".content-block p")
    .map((_, element) => $(element).text().trim())
    .get();

  const hrefLinks = $(".post-content a")
    .map((_, element) => $(element).attr("href") ?? "")
    .get();

  const combinedText = paragraphText.join(" ");

  const returnvalue = {
    combinedText: combinedText,
    hrefLinks: hrefLinks,
  };

  return returnvalue;
}

function break_title_into_data(input: string) {
  console.log("input", input);
  const slices = input.split(" ");
  console.log("slices", slices);

  const subject_and_title = {
    subject: " ",
    title: input,
    is_general_announcement: true,
  };
  console.log("slices.includes(-):", slices.includes("-"));
  if (slices.includes("-")) {
    const slices2 = input.split("-");

    subject_and_title.subject = slices2[0]?.trim()!;
    subject_and_title.title = slices2[1]?.trim()!;
    subject_and_title.is_general_announcement = false;
    return subject_and_title;
  }
  console.log("v2 slices.includes(–):", slices.includes("–"));
  if (slices.includes("–")) {
    const slices2 = input.split("–");

    subject_and_title.subject = slices2[0]?.trim()!;
    subject_and_title.title = slices2[1]?.trim()!;
    subject_and_title.is_general_announcement = false;
    return subject_and_title;
  }

  console.log("subject_and_title", subject_and_title);

  return subject_and_title;
}

export async function shouldRunJob() {
  const [latestRun] = await db
    .select({ runDate: jobRuns.runDate })
    .from(jobRuns)
    .orderBy(sql`${jobRuns.runDate} DESC`)
    .limit(1);

  if (!latestRun) {
    return true;
  }

  console.log("latestRun", latestRun);

  const currentTime = new Date();
  console.log("currentTime", currentTime);

  const lastRunTime = new Date(latestRun.runDate);

  const minutesDifference =
    (currentTime.getTime() - lastRunTime.getTime()) / (1000 * 60);

  return minutesDifference >= 50;
}

export async function scrape_vtsns_CRONJOB() {
  const article_page = await scrape_Predmeti_info();
  for (let i = 0; i < article_page.length; i++) {
    const new_hreflinks = [
      ...article_page[i]!.article.hrefLinks,
      article_page[i]!.href,
    ];

    await upsertArticle(
      article_page[i]!.title_analysis.title,
      article_page[i]!.title_analysis.subject,
      article_page[i]!.href_title_date,
      article_page[i]!.article.combinedText,
      article_page[i]!.title_analysis.is_general_announcement,
      article_page[i]!.date!,
      article_page[i]!.href,
      new_hreflinks ?? [],
    );
    if (article_page[i]!.title_analysis.is_general_announcement === false) {
      await upsertSubject(article_page[i]!.title_analysis.subject);
    }
  }
}

async function upsertSubject(name: string) {
  await db
    .insert(subject)
    .values({
      name: name,
    })
    .onConflictDoUpdate({
      target: [subject.name],
      set: {
        name: name,
      },
    });
}

async function upsertArticle(
  title: string,
  subject: string,
  href_title_date: string,
  text: string,
  isSpecial_announcement: boolean,
  Date: Date,
  href_url: string,
  hrefs?: string[],
) {
  await db
    .insert(article)
    .values({
      title: title,
      subject: subject,
      href_title_date: href_title_date,
      text: text,
      href_links: hrefs ?? [],
      createdAt: Date,
      updatedAt: Date,
      isSpecial_announcement: isSpecial_announcement,
      href: href_url,
    })
    .onConflictDoUpdate({
      target: [article.href_title_date],
      set: {
        title: title,
        subject: subject,
        text: text,
        href_links: hrefs ?? [],
        createdAt: Date,
        isSpecial_announcement: isSpecial_announcement,
      },
    });
}
