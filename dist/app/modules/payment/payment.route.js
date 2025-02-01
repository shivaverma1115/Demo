"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userVerify_1 = __importDefault(require("../../../middleware/userVerify"));
const payment_controller_1 = require("./payment.controller");
const express_1 = __importDefault(require("express"));
const PaymentRoute = express_1.default.Router();
// all Routes
PaymentRoute.post("/payment-intent", userVerify_1.default, payment_controller_1.CreatePaymentIntent);
exports.default = PaymentRoute;
