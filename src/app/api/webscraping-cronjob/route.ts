// app/api/data/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { jobRuns } from "~/server/db/schema";
import {
  shouldRunJob,
  scrape_vtsns_CRONJOB,
} from "~/utilities/random-functions";

// Define the expected structure of the request data

export async function POST(request: Request) {
  console.log("attempting cron job");
  try {
    // Parse the JSON body and assert the type

    const should_run_cron = await shouldRunJob();
    if (should_run_cron === true) {
      //if (1 > 0) {
      await scrape_vtsns_CRONJOB();
      const currentTime = new Date();
      await db.insert(jobRuns).values({
        runDate: currentTime, // Set runDate to the current time
      });
      return NextResponse.json({ received: true, status: 200, Skipped: false });
    }
    // Process the data (e.g., save it to a database or perform other operations)

    // Respond with a success message and the received data

    return NextResponse.json({
      received: true,
      status: 200,
      Skipped: true,
    });
  } catch (error) {
    // Handle any errors and return an error response
    return NextResponse.json(
      { message: "Failed to process data", error: (error as Error).message },
      { status: 400 },
    );
  }
}
