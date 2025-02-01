"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategory = exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categoryScema = new mongoose_1.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    categoryclass: {
        type: String,
        required: true,
        trim: true,
    },
    categoryThumb: {
        type: String,
        required: true,
        trim: true,
    },
});
const subcategoryScema = new mongoose_1.Schema({
    subCategoryName: {
        type: String,
        required: true,
        trim: true,
    },
    subcategoryclass: {
        type: String,
        required: true,
        trim: true,
    },
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    brandImg: {
        type: String,
        trim: true,
    },
});
exports.Category = (0, mongoose_1.model)("Category", categoryScema);
exports.SubCategory = (0, mongoose_1.model)("SubCategory", subcategoryScema);
