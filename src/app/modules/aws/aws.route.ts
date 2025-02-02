// upload.route.js
import { Request, Response } from "express";
import multer from 'multer';
import { deleteImg, uploadImg, uploadAndCompressPDF, uploadMedia } from './aws.controller'
// Configure Multer
const upload = multer({
    dest: 'uploads/',
});

const awsRouter = require("express").Router();
awsRouter.post('/', upload.single('media'), uploadMedia);
awsRouter.post('/', upload.single('image'), uploadImg);
awsRouter.post('/pdf', upload.single('pdf'), uploadAndCompressPDF);
awsRouter.delete('/delete', deleteImg);



/*To handle all invalid request */
awsRouter.all("*", (req: Request, res: Response) => {
    res.status(500).json({ status: "failed", message: res });
});

export default awsRouter;