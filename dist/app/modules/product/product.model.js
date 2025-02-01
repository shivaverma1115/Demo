"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffProduct = exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    categoryName: { type: String, required: true, trim: true },
    oldPrice: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    productDetails: { type: String, required: true, trim: true },
    productImages: { type: [String], required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    productQuantity: { type: Number, required: true, trim: true },
    subcategoryName: { type: String, required: true, trim: true },
    img: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    offer: { type: Boolean, required: true },
    offerPersent: { type: Number, required: true },
    rettings: { type: [Number], required: true },
    productStatus: { type: String, required: true },
});
const OfferproductSchema = new mongoose_1.Schema({
    productId: { type: String, required: true, trim: true },
    oldPrice: { type: Number, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    productDetails: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    banner: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    offerPersent: { type: Number, required: true },
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
exports.OffProduct = (0, mongoose_1.model)("OffProduct", OfferproductSchema);
