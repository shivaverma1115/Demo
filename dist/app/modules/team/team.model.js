"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const skillSchema = new mongoose_1.Schema({
    skillName: { type: String, required: true, trim: true },
    precent: { type: String, required: true, trim: true },
});
const userSchema = new mongoose_1.Schema({
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
    skills: [skillSchema],
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
});
exports.Team = (0, mongoose_1.model)("Team", userSchema);
