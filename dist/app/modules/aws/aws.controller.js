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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = exports.uploadAndCompressPDF = exports.deleteImg = exports.uploadMedia = exports.uploadImg = void 0;
const fs_1 = __importDefault(require("fs"));
const aws_services_1 = require("./services/aws.services");
const promises_1 = require("fs/promises");
// import { PDFDocument } from 'pdf-lib';
// import path from 'path';
// add images 
const uploadImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "It must have an media" });
        }
        if (file.size > 10000000) { // 10MB
            return res.status(400).json({ message: "Media should be less than 10 MB" });
        }
        const result = yield (0, aws_services_1.uploadFile)(file);
        yield (0, promises_1.unlink)(file.path);
        return res.status(200).json(result);
    }
    catch (e) {
        console.log("error----->", e);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.uploadImg = uploadImg;
function uploadMedia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: "A media file is required" });
            }
            if (file.size > 50000000) { // 50MB size limit for videos
                return res.status(400).json({ message: "Media should be less than 50MB" });
            }
            const uploadResult = yield (0, aws_services_1.uploadFile)(file);
            // Delete Local File
            yield (0, promises_1.unlink)(file.path);
            // Generate a signed URL (valid for 15 minutes)
            const signedUrl = (0, aws_services_1.generateSignedUrl)(uploadResult.Key);
            // Schedule file deletion after 15 minutes
            (0, aws_services_1.scheduleFileDeletion)(uploadResult.Key, 900);
            return res.status(200).json({ signedUrl, expiresIn: 900 });
        }
        catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
exports.uploadMedia = uploadMedia;
const deleteImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isKey = req.body.Key;
        if (!isKey) {
            return res.status(400).json({ message: "It must have an key" });
        }
        const isDelete = yield (0, aws_services_1.deleteFile)(isKey);
        console.log("Delete result:", isDelete);
        return res.status(200).json({
            isdelete: isDelete
        });
    }
    catch (e) {
        console.log("error----->", e);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteImg = deleteImg;
function uploadAndCompressPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const filePath = file.path;
            const fileBuffer = fs_1.default.readFileSync(filePath);
            // const pdfDoc = await PDFDocument.load(fileBuffer);
            // pdfDoc.setCreator('');
            // pdfDoc.setProducer('');
            // pdfDoc.setTitle('');
            // pdfDoc.setSubject('');
            // pdfDoc.setKeywords([]);
            // const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
            // const compressedPath = path.join('compressed', `${Date.now()}_compressed.pdf`);
            // if (!fs.existsSync('compressed')) fs.mkdirSync('compressed');
            // fs.writeFileSync(compressedPath, compressedPdfBytes);
            // const fileStream = fs.createReadStream(compressedPath);
            // const uploadParams = {
            //     Bucket: bucketName,
            //     Body: fileStream,
            //     Key: `pdf/${file.originalname}`,
            //     ContentType: 'application/pdf',
            // };
            // const result = await s3.upload(uploadParams).promise();
            // fs.unlinkSync(filePath);
            // fs.unlinkSync(compressedPath);
            return res.json({
                message: 'PDF uploaded and compressed successfully',
                // pdfLink: result,
            });
        }
        catch (error) {
            console.error('Error compressing and uploading PDF:', error);
            return res.status(500).json({ error: 'Failed to compress and upload PDF' });
        }
    });
}
exports.uploadAndCompressPDF = uploadAndCompressPDF;
const uploadToS3 = (filePath, key) => {
    const fileContent = fs_1.default.readFileSync(filePath);
    const params = {
        Bucket: aws_services_1.bucketName,
        Key: key,
        Body: fileContent,
        ContentType: 'image/png',
        ACL: 'public-read',
    };
    return aws_services_1.s3.upload(params).promise();
};
exports.uploadToS3 = uploadToS3;
