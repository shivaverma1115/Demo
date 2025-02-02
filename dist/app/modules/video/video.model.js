"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    isExpired: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
exports.Video = (0, mongoose_1.model)("Video", videoSchema);
