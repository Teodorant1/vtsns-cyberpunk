/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sql } from "drizzle-orm";
import got from "got";
import { load } from "cheerio"; // Import load function from Cheerio
import { type PostData } from "~/project-types";
import { db } from "~/server/db";
import { article, jobRuns, subject } from "~/server/db/schema";

export async function scrape_Predmeti_info() {
  // Fetch the page content
  const { body } = await got("https://vtsns.edu.rs/predmeti-info/");
  const $ = load(body); // Use load to parse the HTML

  const postsData: PostData[] = [];

  // Array to hold promises
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

    // Push the promise to the array
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

  // Await all promises to resolve
  const postsDataResolved = await Promise.all(postPromises);
  return postsDataResolved; // Return the resolved data
}

export async function scrape_vtsns_article(url: string) {
  // Fetch the article content
  const { body } = await got(url);
  const $ = load(body); // Use load to parse the HTML

  // Extract text from all <p> elements inside the content block
  const paragraphText = $(".content-block p")
    .map((_, element) => $(element).text().trim())
    .get();

  // Extract all href values from <a> elements
  const hrefLinks = $(".content-block a")
    .map((_, element) => $(element).attr("href") ?? "")
    .get();

  // Combine the paragraph text into a single const value (optional)
  const combinedText = paragraphText.join(" ");

  const returnvalue = {
    combinedText: combinedText,
    hrefLinks: hrefLinks,
  };

  return returnvalue; // Return both results
}

// scrapeWebsite().catch((err) => {
//   console.error("Error:", err);
// });

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

  // else {
  //   const subject_and_action = {
  //     subject: input,
  //     action: input,
  //     is_general_announcement: true,
  //   };
  //   return subject_and_action;
  // }
}

export async function shouldRunJob() {
  // Fetch the latest date from the `job_run` table
  const [latestRun] = await db
    .select({ runDate: jobRuns.runDate })
    .from(jobRuns)
    .orderBy(sql`${jobRuns.runDate} DESC`) // Use sql template to order by DESC
    .limit(1);

  // If no date exists, it's the first run, so return true
  if (!latestRun) {
    return true;
  }

  console.log("latestRun", latestRun);

  // Calculate the time difference in hours
  const currentTime = new Date();
  console.log("currentTime", currentTime);

  const lastRunTime = new Date(latestRun.runDate);
  const hoursDifference =
    (currentTime.getTime() - lastRunTime.getTime()) / (1000 * 60 * 60);

  // Return true if at least 1 hours have passed since the last run
  return hoursDifference >= 1;
}

//we want to grab all of the scraped data from the predmeti-info page , check if they exist, or else just upsert them
export async function scrape_vtsns_CRONJOB() {
  const article_page = await scrape_Predmeti_info(); // Await the promise
  for (let i = 0; i < article_page.length; i++) {
    // const article = article_page[i]!; // Await the individual promise if each item is still a promise
    // const hrefLinks_string = article!.article.hrefLinks.toString();
    await upsertArticle(
      article_page[i]!.title_analysis.title,
      article_page[i]!.title_analysis.subject,
      article_page[i]!.href_title_date,
      article_page[i]!.article.combinedText,
      article_page[i]!.title_analysis.is_general_announcement,
      article_page[i]!.date!,
      article_page[i]!.article.hrefLinks ?? [],
    ); // Process each article

    if (article_page[i]!.title_analysis.is_general_announcement === false) {
      await upsertSubject(article_page[i]!.title_analysis.subject);
    }
  }
}

// Upsert function for the subject model
async function upsertSubject(name: string) {
  await db
    .insert(subject)
    .values({
      name: name,
    })
    .onConflictDoUpdate({
      target: [subject.name], // Define conflict on the unique column
      set: {
        name: name,
      },
    });
}

// Upsert function for the article model
async function upsertArticle(
  title: string,
  subject: string,
  href_title_date: string,
  text: string,
  isSpecial_announcement: boolean,
  Date: Date,
  hrefs?: string[],
) {
  await db
    .insert(article)
    .values({
      title: title,
      subject: subject,
      href_title_date: href_title_date,
      text: text,
      hrefs: hrefs ?? [],
      createdAt: Date,
      updatedAt: Date,
      isSpecial_announcement: isSpecial_announcement,
    })
    .onConflictDoUpdate({
      target: [article.href_title_date], // Define conflict on the unique column
      set: {
        title: title,
        subject: subject,
        href_title_date: href_title_date,
        text: text,
        hrefs: hrefs ?? [],
        createdAt: Date,
        isSpecial_announcement: isSpecial_announcement,
      },
    });
}
