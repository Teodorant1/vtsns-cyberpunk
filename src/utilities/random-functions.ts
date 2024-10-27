/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { sql } from "drizzle-orm";
import puppeteer from "puppeteer"; // Import Puppeteer
import { type PostData } from "~/project-types";
import { db } from "~/server/db";
import { article, jobRuns, subject } from "~/server/db/schema";

export async function scrape_Predmeti_info() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome", // Path to Chrome on Vercel
  });
  const page = await browser.newPage();
  await page.goto("https://vtsns.edu.rs/predmeti-info/");
  await page.waitForSelector(".post-excerpt");

  // Extracting data from each post-excerpt element
  const postElements = await page.$$(".post-excerpt");
  const postsData: PostData[] = [];

  for (const element of postElements) {
    const timeElement = await element.$("time");
    const titleElement = await element.$("h2.entry-title a");

    const datetime =
      (await timeElement?.evaluate((el) => el.getAttribute("datetime"))) ?? "";
    const title =
      (await titleElement?.evaluate((el) => el.textContent?.trim())) ?? "";
    const href =
      (await titleElement?.evaluate((el) => el.getAttribute("href"))) ?? "";

    const date = datetime ? new Date(datetime) : null;
    const href_title_date = `${title}${href}${date?.toDateString()}`;
    const title_analysis = break_title_into_data(title);
    const article = await scrape_vtsns_article(href);

    postsData.push({
      date,
      title,
      href,
      title_analysis,
      href_title_date,
      article,
    });
  }

  await browser.close();
  return postsData;
}

export async function scrape_vtsns_article(url: string) {
  // Launch a new puppeteer browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome", // Path to Chrome on Vercel
  });
  const page = await browser.newPage();

  // Navigate to the desired website
  await page.goto(url);
  await page.waitForSelector(".content-block");

  // Extract text from all <p> elements inside the content block
  const paragraphText = await page.$$eval(".content-block p", (elements) =>
    elements.map((element) => element.textContent?.trim() ?? ""),
  );

  // Extract all href values from <a> elements
  const hrefLinks = await page.$$eval(".content-block a", (elements) =>
    elements.map((element) => element.getAttribute("href") ?? ""),
  );

  // Combine the paragraph text into a single const value (optional)
  const combinedText = paragraphText.join(" ");

  // Close the browser
  await browser.close();

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
