"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const aws_controller_1 = require("./aws.controller");
const path_1 = __importDefault(require("path"));
// Configure Multer Storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files temporarily in "uploads" folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// ✅ Initialize Multer
const upload = (0, multer_1.default)({ storage });
const awsRouter = require("express").Router();
// ✅ Use `upload.single()` correctly
awsRouter.post("/", upload.single("media"), aws_controller_1.uploadMedia);
awsRouter.post("/", upload.single("image"), aws_controller_1.uploadImg);
awsRouter.post("/pdf", upload.single("pdf"), aws_controller_1.uploadAndCompressPDF);
awsRouter.delete("/delete", aws_controller_1.deleteImg);
/* To handle all invalid requests */
awsRouter.all("*", (req, res) => {
    res.status(500).json({ status: "failed", message: "Invalid request" });
});
exports.default = awsRouter;
