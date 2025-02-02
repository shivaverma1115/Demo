import { model, Schema } from "mongoose";
import { IVideo } from "./video.interface";

const videoSchema = new Schema({
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

export const Video = model<IVideo>("Video", videoSchema);
