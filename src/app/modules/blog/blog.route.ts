import express from "express";
import { allBlogs, createBlog, createComment, deleteBlog, deleteComment, getComment, getMyComment, getSingleBlog, searchBlogs, updateBannerImage, updateBlogInfo, updateComment } from "./blog.controller";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";


const blogRoute = express.Router();
// all Routes
blogRoute.post("/create-blog", adminVerify, createBlog);
blogRoute.post("/create-comment", verifyToken, createComment);

blogRoute.get("/all-blog", allBlogs);
blogRoute.get("/search-blog", searchBlogs);
blogRoute.get("/single-blog/:id", getSingleBlog);
blogRoute.get("/comments/:id", getComment);
blogRoute.get("/user-comment", getMyComment);

blogRoute.put("/update-blog-info", adminVerify, updateBlogInfo);
blogRoute.put("/update-banner", adminVerify, updateBannerImage);
blogRoute.put("/update-comment", verifyToken, updateComment);

blogRoute.delete("/delete-blog", adminVerify, deleteBlog);
blogRoute.delete("/delete-comment",verifyToken, deleteComment);


export default blogRoute;
