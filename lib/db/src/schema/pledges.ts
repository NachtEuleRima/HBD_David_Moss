import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pledgesTable = pgTable("pledges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  xUsername: text("x_username"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPledgeSchema = createInsertSchema(pledgesTable)
  .omit({ id: true, createdAt: true })
  .extend({
    name: z.string().min(1).max(100),
    amount: z.coerce.number().min(1).max(1500),
  });

export type InsertPledge = z.infer<typeof insertPledgeSchema>;
export type Pledge = typeof pledgesTable.$inferSelect;
