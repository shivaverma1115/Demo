"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const userVerify_1 = __importDefault(require("../../../middleware/userVerify"));
const adminVerify_1 = __importDefault(require("../../../middleware/adminVerify"));
const blogRoute = express_1.default.Router();
// all Routes
blogRoute.post("/create-blog", adminVerify_1.default, blog_controller_1.createBlog);
blogRoute.post("/create-comment", userVerify_1.default, blog_controller_1.createComment);
blogRoute.get("/all-blog", blog_controller_1.allBlogs);
blogRoute.get("/search-blog", blog_controller_1.searchBlogs);
blogRoute.get("/single-blog/:id", blog_controller_1.getSingleBlog);
blogRoute.get("/comments/:id", blog_controller_1.getComment);
blogRoute.get("/user-comment", blog_controller_1.getMyComment);
blogRoute.put("/update-blog-info", adminVerify_1.default, blog_controller_1.updateBlogInfo);
blogRoute.put("/update-banner", adminVerify_1.default, blog_controller_1.updateBannerImage);
blogRoute.put("/update-comment", userVerify_1.default, blog_controller_1.updateComment);
blogRoute.delete("/delete-blog", adminVerify_1.default, blog_controller_1.deleteBlog);
blogRoute.delete("/delete-comment", userVerify_1.default, blog_controller_1.deleteComment);
exports.default = blogRoute;
