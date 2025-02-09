"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    url: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});
// Virtual field to check if the video is expired
videoSchema.virtual("isExpired").get(function () {
    return Date.now() - this.createdAt.getTime() > 60 * 60 * 1000; // 1 hour
});
exports.Video = (0, mongoose_1.model)("Video", videoSchema);
