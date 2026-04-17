import { Router } from "express";
import { getUncachableStripeClient, getStripePublishableKey } from "../stripeClient";

const router = Router();

router.get("/config", async (req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err) {
    res.status(500).json({ error: "Failed to load Stripe config" });
  }
});

router.post("/create-payment-intent", async (req, res) => {
  const session = req.session as any;
  if (!session.xUser) {
    res.status(401).json({ error: "Please sign in with X to pledge" });
    return;
  }

  const { amount, name } = req.body;
  const parsedAmount = parseFloat(amount);

  if (!name || typeof name !== "string" || name.trim().length < 1) {
    res.status(400).json({ error: "Invalid name" });
    return;
  }
  if (isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 1500) {
    res.status(400).json({ error: "Amount must be between $1 and $1,500" });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parsedAmount * 100),
      currency: "usd",
      metadata: {
        name: name.trim(),
        xUsername: session.xUser.username,
        pledgeName: name.trim(),
      },
      description: `FSD Coast to Coast Gift pledge from ${session.xUser.username}`,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe create-payment-intent error:", err);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

export default router;
