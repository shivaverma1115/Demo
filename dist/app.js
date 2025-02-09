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
// cors
app.use((0, cors_1.default)({
    origin: "*", // Or specify your frontend: ["http://localhost:3000", "https://your-frontend.com"]
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));
// Handle preflight OPTIONS requests
app.options("*", (0, cors_1.default)());
// parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// routes
app.use("/user", user_route_1.default);
// app.use("/setting", SettingsRouter);
// app.use("/product", productRoute);
// app.use("/user-input", userInputRoute);
// app.use("/payment", PaymentRoute);
// app.use("/success", paymentSuccess);
// app.use("/blog", blogRoute);
// app.use("/team", teamRoute);
app.use("/upload", aws_route_1.default);
app.use("/video", video_route_1.default);
exports.default = app;
