import express from "express";
import {
  createVideoSample,
  getSampleVideo,
  getWeddingInfo,
} from "./video.controller";
const sampleVideoRoute = express.Router();

// all Routes
sampleVideoRoute.post("/", getSampleVideo);
sampleVideoRoute.get("/:id", getWeddingInfo);
sampleVideoRoute.post("/create-video-sample", createVideoSample);

export default sampleVideoRoute;
