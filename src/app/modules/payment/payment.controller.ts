import { Request, Response } from "express";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

export const CreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const { totalPrice } = req.body;
    const amount = totalPrice * 100; 

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error:any) {
    console.error("Error creating PaymentIntent:", error.message);
    res.status(500).json({ error: "Failed to create PaymentIntent." });
  }
};
