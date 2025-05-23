import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { jobRuns } from "~/server/db/schema";
import {
  shouldRunJob,
  scrape_vtsns_CRONJOB,
} from "~/utilities/random-functions";

export async function POST(request: Request) {
  console.log("attempting cron job");
  try {
    const should_run_cron = await shouldRunJob();
    if (should_run_cron === true) {
      // we might need this to debug later
      // if (1 > 0) {
      await scrape_vtsns_CRONJOB();

      const currentTime = new Date();
      await db.insert(jobRuns).values({
        runDate: currentTime,
      });
      return NextResponse.json({ received: true, status: 200, Skipped: false });
    }

    return NextResponse.json({
      received: true,
      status: 200,
      Skipped: true,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Failed to process data", error: error as Error },
      { status: 400 },
    );
  }
}
