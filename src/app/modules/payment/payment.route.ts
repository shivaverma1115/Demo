import verifyToken from '../../../middleware/userVerify';
import { CreatePaymentIntent } from './payment.controller';

import express from "express";


const PaymentRoute = express.Router();
// all Routes
PaymentRoute.post("/payment-intent", verifyToken, CreatePaymentIntent);


export default PaymentRoute;
