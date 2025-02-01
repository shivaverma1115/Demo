"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelOrder = exports.Order = void 0;
const mongoose_1 = require("mongoose");
const ShipMentStatusScema = new mongoose_1.Schema({
    orderStatusDate: String,
    shipmentStatus: String,
});
const orderScema = new mongoose_1.Schema({
    buyerEmail: String,
    name: String,
    Address: String,
    City: String,
    Postcode: String,
    EmailAddress: String,
    date: String,
    orderStatusDate: String,
    Phone: String,
    totalPrice: Number,
    orderProducts: Array,
    paymentId: String,
    shipmentStatus: String,
    orderId: String,
    shipmentStatusArray: { type: [ShipMentStatusScema] || undefined }
});
const cancelOrderScema = new mongoose_1.Schema({
    buyerEmail: String,
    EmailAddress: String,
    date: String,
    Phone: String,
    productId: String,
    productName: String,
    returnAmount: Number,
    paymentId: String,
    orderId: String,
    returnStatus: String,
    orderProduct: Object,
});
exports.Order = (0, mongoose_1.model)("Order", orderScema);
exports.CancelOrder = (0, mongoose_1.model)("CancelOrder", cancelOrderScema);
