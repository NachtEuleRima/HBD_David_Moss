import { Router } from "express";
import { db, pledgesTable } from "@workspace/db";
import { sum, count, eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";

const GOAL_AMOUNT = 1500;

const router = Router();

router.post("/", async (req, res) => {
  const session = req.session as any;

  if (!session.xUser) {
    res.status(401).json({ error: "Please sign in with X to pledge" });
    return;
  }

  const { paymentIntentId } = req.body;

  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    res.status(400).json({ error: "Payment required to pledge" });
    return;
  }

  let stripe: Awaited<ReturnType<typeof getUncachableStripeClient>>;
  try {
    stripe = await getUncachableStripeClient();
  } catch {
    res.status(500).json({ error: "Payment system unavailable" });
    return;
  }

  let paymentIntent: any;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    res.status(400).json({ error: "Invalid payment reference" });
    return;
  }

  if (paymentIntent.status !== "succeeded") {
    res.status(400).json({ error: "Payment not completed" });
    return;
  }

  const name = paymentIntent.metadata?.name || paymentIntent.metadata?.pledgeName;
  const xUsername = paymentIntent.metadata?.xUsername;

  if (!name) {
    res.status(400).json({ error: "Invalid payment metadata" });
    return;
  }

  if (xUsername && xUsername !== session.xUser.username) {
    res.status(403).json({ error: "Payment mismatch" });
    return;
  }

  const amount = (paymentIntent.amount / 100).toFixed(2);

  const summaryResult = await db
    .select({ total: sum(pledgesTable.amount) })
    .from(pledgesTable);
  const currentTotal = parseFloat(summaryResult[0]?.total ?? "0");

  if (currentTotal >= GOAL_AMOUNT) {
    res.status(400).json({ error: "Goal already reached" });
    return;
  }

  const existing = await db
    .select()
    .from(pledgesTable)
    .where(eq(pledgesTable.stripePaymentIntentId, paymentIntentId))
    .limit(1);

  if (existing.length > 0) {
    res.status(200).json({
      id: existing[0].id,
      name: existing[0].name,
      amount: parseFloat(existing[0].amount),
      createdAt: existing[0].createdAt,
    });
    return;
  }

  const [pledge] = await db
    .insert(pledgesTable)
    .values({
      name,
      amount,
      xUsername: session.xUser.username,
      stripePaymentIntentId: paymentIntentId,
    })
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
      xUsername: p.xUsername,
      xAvatarUrl: p.xAvatarUrl,
    })),
  });
});

router.patch("/:id", async (req, res) => {
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

  const { xUsername, xAvatarUrl } = req.body;
  if (typeof xUsername !== "string" && typeof xAvatarUrl !== "string") {
    res.status(400).json({ error: "xUsername or xAvatarUrl required" });
    return;
  }

  const updateData: Record<string, string | null> = {};
  if (typeof xUsername === "string") updateData.xUsername = xUsername || null;
  if (typeof xAvatarUrl === "string") updateData.xAvatarUrl = xAvatarUrl || null;

  const [updated] = await db
    .update(pledgesTable)
    .set(updateData)
    .where(eq(pledgesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Pledge not found" });
    return;
  }

  res.json({ success: true, pledge: updated });
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
