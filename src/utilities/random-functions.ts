/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sql } from "drizzle-orm";
import got from "got";
import { load } from "cheerio";
import { type PostData } from "~/project-types";
import { db } from "~/server/db";
import {
  article,
  // type article_type,
  jobRuns,
  subject,
} from "~/server/db/schema";
// import HrefLinks from "~/app/_components/href_list";

export async function scrape_Predmeti_info() {
  const { body } = await got("https://vtsns.edu.rs/predmeti-info/");
  const $ = load(body);

  const postPromises: Promise<PostData>[] = [];

  $(".post-excerpt").each((index, element) => {
    const timeElement = $(element).find("time");
    const titleElement = $(element).find("h2.entry-title a");

    const datetime = timeElement.attr("datetime") ?? "";

    // console.log("datetime", datetime);

    const title = titleElement.text().trim() ?? "";
    const href = titleElement.attr("href") ?? "";

    const date = datetime ? new Date(datetime) : null;

    // console.log("datetime constructed into date", date);

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

  console.log("postsDataResolved", postsDataResolved);

  const refinedPosts: {
    text: string;
    href: string;
    title: string;
    href_title_date: string;
    subject: string;
    href_links: string[];
    createdAt: Date;
    updatedAt: Date | null;
    isSpecial_announcement: boolean;
    has_been_announced_in_discord: boolean | null;
  }[] = [];
  // console.log(refinedPosts);
  for (let i = 0; i < postsDataResolved.length; i++) {
    const article = {
      text: postsDataResolved[i]?.article.combinedText ?? "",
      href: postsDataResolved[i]?.href ?? "",
      title: postsDataResolved[i]?.title ?? "",
      href_title_date: postsDataResolved[i]?.href_title_date ?? "",
      subject: postsDataResolved[i]?.title_analysis.subject ?? "",
      href_links: postsDataResolved[i]?.article.hrefLinks ?? [],
      createdAt: postsDataResolved[i]?.date ?? new Date(),
      updatedAt: new Date(),
      isSpecial_announcement:
        postsDataResolved[i]?.title_analysis.is_general_announcement ?? false,
      has_been_announced_in_discord: false,
    };
    refinedPosts.push(article);
  }

  // return postsDataResolved;

  return refinedPosts;
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
  // console.log("input", input);
  const slices = input.split(" ");
  // console.log("slices", slices);

  const subject_and_title = {
    subject: " ",
    title: input,
    is_general_announcement: true,
  };
  // console.log("slices.includes(-):", slices.includes("-"));
  if (slices.includes("-")) {
    const slices2 = input.split("-");

    subject_and_title.subject = slices2[0]?.trim()!;
    subject_and_title.title = slices2[1]?.trim()!;
    subject_and_title.is_general_announcement = false;
    return subject_and_title;
  }
  // console.log("v2 slices.includes(–):", slices.includes("–"));
  if (slices.includes("–")) {
    const slices2 = input.split("–");

    subject_and_title.subject = slices2[0]?.trim()!;
    subject_and_title.title = slices2[1]?.trim()!;
    subject_and_title.is_general_announcement = false;
    return subject_and_title;
  }

  // console.log("subject_and_title", subject_and_title);

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

  // console.log("latestRun", latestRun);

  const currentTime = new Date();
  // console.log("currentTime", currentTime);

  const lastRunTime = new Date(latestRun.runDate);

  const minutesDifference =
    (currentTime.getTime() - lastRunTime.getTime()) / (1000 * 60);

  return minutesDifference >= 50;
}

export async function scrape_vtsns_CRONJOB() {
  const article_page = await scrape_Predmeti_info();
  await upsertArticle(article_page);
  //  for (let i = 0; i < article_page.length; i++) {
  //   const new_hreflinks = [
  //     ...article_page[i]!.article.hrefLinks,
  //     article_page[i]!.href,
  //   ];

  //   await upsertArticle(
  //     article_page[i]!.title_analysis.title,
  //     article_page[i]!.title_analysis.subject,
  //     article_page[i]!.href_title_date,
  //     article_page[i]!.article.combinedText,
  //     article_page[i]!.title_analysis.is_general_announcement,
  //     article_page[i]!.date!,
  //     article_page[i]!.href,
  //     new_hreflinks ?? [],
  //   );.title_analysis.is_general_announcement === false
  // if (article_page[i]!.title. === false) {
  await upsertSubject(article_page);
  //  }
  // }
}

async function upsertSubject(
  refinedPosts: {
    text: string;
    href: string;
    title: string;
    href_title_date: string;
    subject: string;
    href_links: string[];
    createdAt: Date;
    updatedAt: Date | null;
    isSpecial_announcement: boolean;
    has_been_announced_in_discord: boolean | null;
  }[],
) {
  const subjects: { name: string }[] = [];
  for (let i = 0; i < refinedPosts.length; i++) {
    subjects.push({ name: refinedPosts[i]?.subject ?? "" });
  }

  await db.insert(subject).values(subjects).onConflictDoNothing();
  // .onConflictDoUpdate({
  //   target: [subject.name],
  //   set: {
  //     name: subject.name,
  //   },
  // })
  // .returning();
}

async function upsertArticle(
  refinedPosts: {
    text: string;
    href: string;
    title: string;
    href_title_date: string;
    subject: string;
    href_links: string[];
    createdAt: Date;
    updatedAt: Date | null;
    isSpecial_announcement: boolean;
    has_been_announced_in_discord: boolean | null;
  }[],
) {
  await db
    .insert(article)
    .values(refinedPosts)
    //  .onConflictDoNothing();
    .onConflictDoUpdate({
      target: [article.href_title_date],
      set: {
        href_links: sql`${article.href_links}`, // Use SQL helper to reference the column properly
        text: sql`${article.text}`, // Use SQL helper to reference the column properly
      },
    });
}
