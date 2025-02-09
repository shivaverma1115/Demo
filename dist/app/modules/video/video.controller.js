"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeddingInfo = exports.getSampleVideo = exports.createVideoSample = void 0;
const video_model_1 = require("./video.model");
const createVideoSample = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoInfo = req.body;
        const { title, url } = videoInfo;
        const isNew = yield video_model_1.Video.create({
            title,
            url
        });
        return res.status(201).send({
            message: 'successfuly created',
            isNew
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createVideoSample = createVideoSample;
const getSampleVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const demoVideo = yield video_model_1.Video.find().sort({ _id: -1 }).select("_id title isExpired").limit(10);
        return res.status(200).send({
            message: 'successfuly fetch',
            demoVideo
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSampleVideo = getSampleVideo;
const getWeddingInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const demoVideo = yield video_model_1.Video.findOne({ _id: id }).select("_id title url isExpired createdAt");
        if (!demoVideo) {
            return res.status(404).send({
                message: 'Video not found'
            });
        }
        // Check if the video is older than 1 hour
        const currentTime = new Date().getTime();
        const videoCreatedAt = demoVideo.createdAt.getTime();
        const timeDifference = currentTime - videoCreatedAt; // in milliseconds
        // If the video is older than 1 hour, set isExpired to true
        if (timeDifference > 60 * 60 * 1000) { // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
            demoVideo.isExpired = true;
            yield demoVideo.save(); // Save the updated video document
        }
        return res.status(200).send({
            message: 'successfuly fetch',
            demoVideo
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getWeddingInfo = getWeddingInfo;
