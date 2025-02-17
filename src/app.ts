import express, { Application } from "express";
import cors from "cors";
import UserRouter from "./app/modules/user/user.route";
import awsRouter from "./app/modules/aws/aws.route";
import sampleVideoRoute from "./app/modules/video/video.route";
const app: Application = express();

// cors
app.use(
    cors()
);

// Handle preflight OPTIONS requests
app.options("*", cors());

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/user", UserRouter);
app.use("/upload", awsRouter);
app.use("/video", sampleVideoRoute);

export default app;
