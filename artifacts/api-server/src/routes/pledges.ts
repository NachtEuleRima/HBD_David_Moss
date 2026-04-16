import { Router } from "express";
import { db, pledgesTable } from "@workspace/db";
import { CreatePledgeBody } from "@workspace/api-zod";
import { sum, count, eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

const GOAL_AMOUNT = 1500;

const router = Router();

router.post("/", async (req, res) => {
  const session = req.session as any;

  if (!session.xUser) {
    res.status(401).json({ error: "Please sign in with X to pledge" });
    return;
  }

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
    .values({ name, amount: String(amount), xUsername: session.xUser.username })
    .returning();

  res.status(201).json({
    id: pledge.id,
    name: pledge.name,
    amount: parseFloat(pledge.amount),
    createdAt: pledge.createdAt,
  });
});

router.get("/summary", async (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  const isAdmin = adminPassword && adminPassword === process.env.ADMIN_PASSWORD;

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
      ...(isAdmin ? { xUsername: p.xUsername } : {}),
    })),
  });
});

router.delete("/:id", async (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const deleted = await db
    .delete(pledgesTable)
    .where(eq(pledgesTable.id, id))
    .returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Pledge not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
