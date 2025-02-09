
import { Request, Response } from "express";
import { bucketName, deleteFile, uploadFile, s3, generateSignedUrl, scheduleFileDeletion } from './services/aws.services'
import { unlink } from 'fs/promises';
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);


export async function uploadMedia(req: Request, res: Response) {
    try {
        const file: any = req.file;
        if (!file) return res.status(400).json({ message: "A media file is required" });

        // Compressed file path
        const compressedFilePath = `uploads/compressed-${file.filename}`;

        // 🔹 Compress video using FFmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(file.path)
                .output(compressedFilePath)
                .videoCodec("libx264") // Use H.264 codec
                .audioCodec("aac")
                .size("480x270") // Reduce resolution to 270p (smaller file)
                .videoBitrate("300k") // Reduce video bitrate (lower quality)
                .audioBitrate("32k") // Lower audio bitrate
                .fps(12) // Reduce frame rate to 12 FPS
                .outputOptions([
                    "-preset ultrafast", // Faster compression, lower quality
                    "-crf 40", // Higher CRF means lower quality (range: 0-51)
                    "-tune film" // Optimize for general video content
                ])
                .on("end", resolve)
                .on("error", reject)
                .run();
        });

        // 🔹 Upload to AWS S3
        const fileStream = fs.createReadStream(compressedFilePath);
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `compressed/${file.filename}`,
            Body: fileStream,
            ContentType: "video/mp4",
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        // ✅ Delete local files after upload
        fs.unlinkSync(file.path);
        fs.unlinkSync(compressedFilePath);

        // Generate a signed URL (valid for 1 hour)
        const signedUrl = generateSignedUrl(uploadResult.Key);

        // Schedule file deletion after 1 hour
        scheduleFileDeletion(uploadResult.Key, 3600);

        return res.status(200).json({ signedUrl, expiresIn: 3600 });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// add images 
export const uploadImg = async (req: Request, res: Response) => {
    try {
        const file: any = req.file;
        if (!file) {
            return res.status(400).json({ message: "It must have an media" });
        }
        if (file.size > 10000000) {  // 10MB
            return res.status(400).json({ message: "Media should be less than 10 MB" });
        }
        const result = await uploadFile(file);
        await unlink(file.path);
        return res.status(200).json(result);
    } catch (e) {
        console.log("error----->", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// export async function uploadMedia(req: Request, res: Response) {
//     try {
//         const file: any = req.file;
//         if (!file) {
//             return res.status(400).json({ message: "A media file is required" });
//         }
//         if (file.size > 50000000) { // 50MB size limit for videos
//             return res.status(400).json({ message: "Media should be less than 50MB" });
//         }

//         const uploadResult = await uploadFile(file);

//         // Delete Local File
//         await unlink(file.path);

//         // Generate a signed URL (valid for 15 minutes)
//         const signedUrl = generateSignedUrl(uploadResult.Key);

//         // Schedule file deletion after 15 minutes
//         scheduleFileDeletion(uploadResult.Key, 3600);

//         return res.status(200).json({ signedUrl, expiresIn: 900 });
//     } catch (error) {
//         console.error("Upload error:", error);
//         return res.status(500).json({ message: "Internal server error" + error });
//     }
// }


export const deleteImg = async (req: Request, res: Response) => {
    try {
        const isKey = req.body.Key;
        if (!isKey) {
            return res.status(400).json({ message: "It must have an key" });
        }
        const isDelete = await deleteFile(isKey);
        console.log("Delete result:", isDelete);
        return res.status(200).json({
            isdelete: isDelete
        });
    } catch (e) {
        console.log("error----->", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export async function uploadAndCompressPDF(req: any, res: Response): Promise<any> {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = file.path;
        const fileBuffer = fs.readFileSync(filePath);

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
    } catch (error) {
        console.error('Error compressing and uploading PDF:', error);
        return res.status(500).json({ error: 'Failed to compress and upload PDF' });
    }
}

export const uploadToS3 = (filePath: string, key: string): Promise<AWS.S3.ManagedUpload.SendData> => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: 'image/png',
        ACL: 'public-read',
    };

    return s3.upload(params).promise();
};