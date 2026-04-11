import { Router } from "express";
import { db, pledgesTable } from "@workspace/db";
import { insertPledgeSchema } from "@workspace/db";
import { CreatePledgeBody } from "@workspace/api-zod";
import { sum, count } from "drizzle-orm";
import { desc } from "drizzle-orm";

const GOAL_AMOUNT = 300;

const router = Router();

router.post("/", async (req, res) => {
  const parsed = CreatePledgeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { name, amount } = parsed.data;

  const summaryResult = await db
    .select({ total: sum(pledgesTable.amount) })
    .from(pledgesTable);
  const currentTotal = parseFloat(summaryResult[0]?.total ?? "0");

  if (currentTotal >= GOAL_AMOUNT) {
    res.status(400).json({ error: "Goal already reached" });
    return;
  }

  const [pledge] = await db
    .insert(pledgesTable)
    .values({ name, amount: String(amount) })
    .returning();

  res.status(201).json({
    id: pledge.id,
    name: pledge.name,
    amount: parseFloat(pledge.amount),
    createdAt: pledge.createdAt,
  });
});

router.get("/summary", async (_req, res) => {
  const pledges = await db
    .select()
    .from(pledgesTable)
    .orderBy(desc(pledgesTable.createdAt));

  const totalResult = await db
    .select({ total: sum(pledgesTable.amount), count: count() })
    .from(pledgesTable);

  const total = parseFloat(totalResult[0]?.total ?? "0");
  const pledgeCount = totalResult[0]?.count ?? 0;

  res.json({
    total,
    count: pledgeCount,
    goalAmount: GOAL_AMOUNT,
    goalReached: total >= GOAL_AMOUNT,
    pledges: pledges.map((p) => ({
      id: p.id,
      name: p.name,
      amount: parseFloat(p.amount),
      createdAt: p.createdAt,
    })),
  });
});

export default router;
