"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentIntent = void 0;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const CreatePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { totalPrice } = req.body;
        const amount = totalPrice * 100;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error("Error creating PaymentIntent:", error.message);
        res.status(500).json({ error: "Failed to create PaymentIntent." });
    }
});
exports.CreatePaymentIntent = CreatePaymentIntent;
