"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blogScema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    blogDetails: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    commentsArray: {
        type: [Number],
        required: true,
        trim: true,
    },
    authorEmail: {
        type: String,
        required: true,
        trim: true,
    },
    comment: {
        type: Number,
        required: true,
        trim: true,
    },
});
const commentSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    comment: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    postId: { type: String, required: true },
    img: { type: String, trim: true },
    title: { type: String, trim: true },
});
exports.Blog = (0, mongoose_1.model)("Blog", blogScema);
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
