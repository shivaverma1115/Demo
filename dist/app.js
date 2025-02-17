"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const aws_route_1 = __importDefault(require("./app/modules/aws/aws.route"));
const video_route_1 = __importDefault(require("./app/modules/video/video.route"));
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: 'https://admin.gccreator.in', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Allow credentials (cookies, etc.)
};
app.use((0, cors_1.default)(corsOptions)); // Apply CORS with the defined options
// Handle preflight OPTIONS requests
app.options("*", (0, cors_1.default)(corsOptions));
// Parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/user", user_route_1.default);
app.use("/upload", aws_route_1.default);
app.use("/video", video_route_1.default);
exports.default = app;
