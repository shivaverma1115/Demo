"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_controller_1 = require("./video.controller");
const sampleVideoRoute = express_1.default.Router();
// all Routes
sampleVideoRoute.post("/", video_controller_1.getSampleVideo);
sampleVideoRoute.get("/:id", video_controller_1.getWeddingInfo);
sampleVideoRoute.post("/create-video-sample", video_controller_1.createVideoSample);
exports.default = sampleVideoRoute;
