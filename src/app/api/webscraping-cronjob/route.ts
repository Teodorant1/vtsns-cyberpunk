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
    return NextResponse.json(
      { message: "Failed to process data", error: (error as Error).message },
      { status: 400 },
    );
  }
}
