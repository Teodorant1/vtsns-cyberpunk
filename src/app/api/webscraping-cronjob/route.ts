// app/api/data/route.ts
import { NextResponse } from "next/server";
import { type RequestData } from "~/project-types";
import {
  shouldRunJob,
  scrape_vtsns_CRONJOB,
} from "~/utilities/random-functions";

// Define the expected structure of the request data

export async function POST(request: Request) {
  try {
    // Parse the JSON body and assert the type
    const data = (await request.json()) as RequestData;

    const should_run_cron = await shouldRunJob();
    if (should_run_cron === true) {
      await scrape_vtsns_CRONJOB();
    }
    // Process the data (e.g., save it to a database or perform other operations)
    console.log("Received data:", data);
    // Respond with a success message and the received data
    return NextResponse.json({ received: true, status: 200 });
  } catch (error) {
    // Handle any errors and return an error response
    return NextResponse.json(
      { message: "Failed to process data", error: (error as Error).message },
      { status: 400 },
    );
  }
}
