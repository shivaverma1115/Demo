"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundInfo = exports.ContactInfo = exports.Reviews = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    productName: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    img: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    productId: { type: String, required: true, trim: true },
    categoryName: { type: String, required: true, trim: true },
    retting: { type: Number, default: 0, trim: true },
});
const contactSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    date: { type: String, trim: true },
});
const RefundSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    productId: { type: String, trim: true },
    paymentId: { type: String, trim: true },
    productName: { type: String, trim: true },
    date: { type: String, trim: true },
});
exports.Reviews = (0, mongoose_1.model)("Reviews", reviewSchema);
exports.ContactInfo = (0, mongoose_1.model)("ContactInfo", contactSchema);
exports.RefundInfo = (0, mongoose_1.model)("RefundInfo", RefundSchema);
