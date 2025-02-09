import { Request, Response } from "express";
import { Video } from "./video.model";

export const createVideoSample = async (req: Request, res: Response) => {
  try {
    const videoInfo = req.body;
    const { title, url } = videoInfo;

    const isNew = await Video.create({
      title,
      url
    })
    return res.status(201).send({
      message: 'successfuly created',
      isNew
    })
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const getSampleVideo = async (req: Request, res: Response) => {
  try {
    const demoVideo = await Video.find().sort({ _id: -1 }).select("_id title isExpired").limit(10);
    return res.status(200).send({
      message: 'successfuly fetch',
      demoVideo
    })
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getWeddingInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const demoVideo = await Video.findOne({ _id: id }).select("_id title url isExpired createdAt");
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
      await demoVideo.save(); // Save the updated video document
    }

    return res.status(200).send({
      message: 'successfuly fetch',
      demoVideo
    })
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
