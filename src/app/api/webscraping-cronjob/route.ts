import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { db } from "~/server/db";
import { jobRuns, error } from "~/server/db/schema";
import {
  shouldRunJob,
  scrape_vtsns_CRONJOB,
} from "~/utilities/random-functions";

export async function POST(request: Request) {
  console.log("attempting cron job");

  try {
    const should_run_cron = await shouldRunJob();
    const skipped = !should_run_cron;

    if (should_run_cron) {
      // Queue the job to run in the background without blocking the response
      const executeJob = async () => {
        try {
          await scrape_vtsns_CRONJOB();

          const currentTime = new Date();
          await db.insert(jobRuns).values({
            runDate: currentTime,
          });
          console.log("Cron job completed successfully");
        } catch (err) {
          console.error("Cron job error:", err);

          if (err instanceof Error) {
            await db.insert(error).values({
              text: err.message,
            });
          }
        }
      };

      if (process.env.NODE_ENV === "production") {
        // On Vercel: use waitUntil to extend function lifetime
        waitUntil(executeJob());
      } else {
        // Locally: fire and forget (or await for testing)
        executeJob().catch(console.error);
      }
    } else {
      console.log("Cron job skipped - should not run");
    }

    // Return immediately with 202 Accepted
    return NextResponse.json({ queued: true, skipped }, { status: 202 });
  } catch (err) {
    console.error("Error checking if job should run:", err);
    return NextResponse.json(
      { message: "Failed to process request", error: err },
      { status: 400 },
    );
  }
}
