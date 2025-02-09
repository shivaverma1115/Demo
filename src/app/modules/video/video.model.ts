import { model, Schema, Document } from "mongoose";

interface IVideo extends Document {
  url: string;
  title: string;
  isExpired: boolean;
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>({
  url: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Virtual field to check if the video is expired
videoSchema.virtual("isExpired").get(function (this: IVideo) {
  return Date.now() - this.createdAt.getTime() > 60 * 60 * 1000; // 1 hour
});

export const Video = model<IVideo>("Video", videoSchema);
