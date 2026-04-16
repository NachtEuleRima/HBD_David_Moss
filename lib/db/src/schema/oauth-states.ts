import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const oauthStatesTable = pgTable("oauth_states", {
  state: text("state").primaryKey(),
  codeVerifier: text("code_verifier").notNull(),
  callbackUrl: text("callback_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
