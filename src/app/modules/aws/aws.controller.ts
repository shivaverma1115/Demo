import fs from 'fs';
import { Request, Response } from "express";
import { bucketName, deleteFile, uploadFile, s3, generateSignedUrl, scheduleFileDeletion } from './services/aws.services'
import { unlink } from 'fs/promises';
// import { PDFDocument } from 'pdf-lib';
// import path from 'path';

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

export async function uploadMedia(req: Request, res: Response) {
    try {
        const file: any = req.file;
        if (!file) {
            return res.status(400).json({ message: "A media file is required" });
        }
        if (file.size > 50000000) { // 50MB size limit for videos
            return res.status(400).json({ message: "Media should be less than 50MB" });
        }

        const uploadResult = await uploadFile(file);

        // Delete Local File
        await unlink(file.path);

        // Generate a signed URL (valid for 15 minutes)
        const signedUrl = generateSignedUrl(uploadResult.Key);

        // Schedule file deletion after 15 minutes
        scheduleFileDeletion(uploadResult.Key, 3600);

        return res.status(200).json({ signedUrl, expiresIn: 900 });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


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