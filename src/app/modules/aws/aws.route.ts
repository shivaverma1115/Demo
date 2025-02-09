import { Request, Response } from "express";
import multer from "multer";
import { deleteImg, uploadImg, uploadAndCompressPDF, uploadMedia } from "./aws.controller";
import path from "path";

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files temporarily in "uploads" folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// ✅ Initialize Multer
const upload = multer({ storage });

const awsRouter = require("express").Router();

// ✅ Use `upload.single()` correctly
awsRouter.post("/", upload.single("media"), uploadMedia);
awsRouter.post("/", upload.single("image"), uploadImg);
awsRouter.post("/pdf", upload.single("pdf"), uploadAndCompressPDF);
awsRouter.delete("/delete", deleteImg);

/* To handle all invalid requests */
awsRouter.all("*", (req: Request, res: Response) => {
    res.status(500).json({ status: "failed", message: "Invalid request" });
});

export default awsRouter;
