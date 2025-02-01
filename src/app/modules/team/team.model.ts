import { model, Schema } from "mongoose";
import { TeamMember } from "./team.interface";

const skillSchema = new Schema({
  skillName: { type: String, required: true, trim: true },
  precent: { type: String, required: true, trim: true },
});

const userSchema = new Schema<TeamMember>({
  title: { type: String, required: true, trim: true },
  subTitle: { type: String, required: true, trim: true },
  img: { type: String, required: true, trim: true },
  imgTwo: { type: String, required: true, trim: true },
  imgThree: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  aboutMe: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  skills: [skillSchema], // skills is an array of Skill objects
  facebook: { type: String, trim: true },
  twitter: { type: String, trim: true },
  instagram: { type: String, trim: true },
  linkedin: { type: String, trim: true },
});

export const Team = model<TeamMember>("Team", userSchema);
