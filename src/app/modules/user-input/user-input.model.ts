import { Schema, model } from "mongoose";
import { UserContactType, UserReturnRequestType, UserReviewType } from "./user-input.interface";

const reviewSchema = new Schema<UserReviewType>({
  productName: { type: String, required: true, trim: true },
  review: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  img: { type: String, trim: true },
  email: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  productId: { type: String, required: true, trim: true },
  categoryName: { type: String, required: true, trim: true },
  retting: { type: Number, default:0, trim: true },
});

const contactSchema = new Schema<UserContactType>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  date: { type: String, trim: true },
});

const RefundSchema = new Schema<UserReturnRequestType>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  productId: { type: String, trim: true },
  paymentId: { type: String, trim: true },
  productName: { type: String, trim: true },
  date: { type: String, trim: true },
});
export const Reviews = model<UserReviewType>("Reviews", reviewSchema);
export const ContactInfo = model<UserContactType>("ContactInfo", contactSchema);
export const RefundInfo = model<UserReturnRequestType>("RefundInfo", RefundSchema);
