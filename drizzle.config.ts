import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.NEXT_PRIVATE_DATABASE_URL,
  },
  tablesFilter: ["vtsns-cyberpunk_*"],
} satisfies Config;
