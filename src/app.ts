import express, { Application } from "express";
import cors from "cors";
import UserRouter from "./app/modules/user/user.route";
import awsRouter from "./app/modules/aws/aws.route";
import sampleVideoRoute from "./app/modules/video/video.route";

const app: Application = express();

// CORS configuration
const corsOptions = {
    origin: 'https://admin.gccreator.in', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions)); // Apply CORS with the defined options

// Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", UserRouter);
app.use("/upload", awsRouter);
app.use("/video", sampleVideoRoute);

export default app;
