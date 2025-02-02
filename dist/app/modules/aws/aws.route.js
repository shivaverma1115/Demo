"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const aws_controller_1 = require("./aws.controller");
// Configure Multer
const upload = (0, multer_1.default)({
    dest: 'uploads/',
});
const awsRouter = require("express").Router();
awsRouter.post('/', upload.single('media'), aws_controller_1.uploadMedia);
awsRouter.post('/', upload.single('image'), aws_controller_1.uploadImg);
awsRouter.post('/pdf', upload.single('pdf'), aws_controller_1.uploadAndCompressPDF);
awsRouter.delete('/delete', aws_controller_1.deleteImg);
/*To handle all invalid request */
awsRouter.all("*", (req, res) => {
    res.status(500).json({ status: "failed", message: res });
});
exports.default = awsRouter;
