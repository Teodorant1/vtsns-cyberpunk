/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { chromium } from "playwright";

function scrape_vtsns_CRONJOB() {
  return 0;
}

export async function scrape_vtsns_article(url: string) {
  // Launch a new Chromium browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the desired website
  await page.goto(url);
  await page.waitForSelector(".content-block");

  // // Extract and log the HTML content of the .content-block element
  // const contentBlockHtml = await page.$eval(".content-block", (element) => {
  //   return element.outerHTML; // Get the outer HTML of the selected element
  // });

  // Extract text from all <p> elements inside the content block
  const paragraphText = await page.$$eval(".content-block p", (elements) =>
    elements.map((element) => element.textContent?.trim() ?? ""),
  );

  // Extract all href values from <a> elements
  const hrefLinks = await page.$$eval(".content-block a", (elements) =>
    elements.map((element) => element.getAttribute("href")),
  );

  // Combine the paragraph text into a single const value (optional)
  const combinedText = paragraphText.join(" ");

  // console.log("Paragraph Text:\n", combinedText);
  // console.log("Links Array:\n", hrefLinks);

  // Close the browser
  await browser.close();

  console.log("Paragraph Text:\n", combinedText);
  console.log("Links Array:\n", hrefLinks);
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
  const slices = input.split(" ");
  if (slices.includes("-")) {
    const slices2 = input.split("-");

    const subject_and_action = {
      subject: slices2[0]?.trim(),
      action: slices2[1]?.trim(),
      isSpecial: false,
    };

    return subject_and_action;
  } else {
    const subject_and_action = {
      subject: input,
      action: " ",
      isSpecial: true,
    };
    return subject_and_action;
  }
}

export async function scrape_Predmeti_info() {
  // Launch a new browser instance
  const browser = await chromium.launch({ headless: true });

  // Create a new browser page
  const page = await browser.newPage();

  // Navigate to the target URL
  await page.goto("https://vtsns.edu.rs/predmeti-info/");

  // Wait for the elements with the class "post-excerpt" to load
  await page.waitForSelector(".post-excerpt");

  // // Scrape the HTML content of all elements with class "post-excerpt"
  // const postExcerptsHtml = await page.$$eval(".post-excerpt", (elements) => {
  //   // Extract the outerHTML from each element
  //   return elements.map((element) => element.outerHTML);
  // });

  // // Log all of the scraped HTML content before doing anything else
  // console.log("Scraped HTML content:");
  // postExcerptsHtml.forEach((html, index) => {
  //   console.log(`Post ${index + 1} HTML:\n`, html);
  // });

  // Extract the required data from each post-excerpt directly with Playwright
  const postsData = await page.$$eval(".post-excerpt", (elements) => {
    return elements.map((element) => {
      // Extract the datetime from the <time> tag
      const timeElement = element.querySelector("time");
      const datetime = timeElement?.getAttribute("datetime") ?? "";

      // Extract the title and href from the <a> tag inside <h2>
      const titleElement = element.querySelector("h2.entry-title a");
      const title = titleElement?.textContent?.trim() ?? "";
      const href = titleElement?.getAttribute("href") ?? "";

      // Convert the datetime string into a JavaScript Date object
      const date = datetime ? new Date(datetime) : null;

      // Return a JSON object with the extracted data
      return {
        date,
        title,
        href,
      };
    });
  });

  // Log the extracted data
  console.log(postsData);

  // Close the browser instance
  await browser.close();

  // Return the extracted data
  return postsData;
}
