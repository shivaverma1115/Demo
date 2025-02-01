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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.deleteComment = exports.getMyComment = exports.getComment = exports.createComment = exports.updateBannerImage = exports.updateBlogInfo = exports.getSingleBlog = exports.deleteBlog = exports.searchBlogs = exports.allBlogs = exports.createBlog = void 0;
const blog_model_1 = require("./blog.model");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productInfo = req.body;
        const { title } = productInfo;
        const alreayExist = yield blog_model_1.Blog.findOne({ title: title });
        if (alreayExist) {
            res.send({ message: "Already Exist" });
        }
        else {
            const newproduct = new blog_model_1.Blog(productInfo);
            yield newproduct.save();
            res.status(200).send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createBlog = createBlog;
const allBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const blogs = yield blog_model_1.Blog.find({})
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const blogCount = yield blog_model_1.Blog.countDocuments();
        const totalPages = Math.ceil(blogCount / parsedLimit);
        res.status(200).send({
            blogs,
            totalPages,
            currentPage: parsedPage,
            blogCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "Error fetching products" });
    }
});
exports.allBlogs = allBlogs;
const searchBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        let keywordArray = [];
        if (searchQuery && typeof searchQuery === "string") {
            keywordArray = searchQuery.split(",");
        }
        else if (Array.isArray(searchQuery)) {
            keywordArray = searchQuery;
        }
        const keywordFilter = keywordArray.map((keyword) => ({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { author: { $regex: keyword, $options: "i" } },
                { blogDetails: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield blog_model_1.Blog.find(query);
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchBlogs = searchBlogs;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_model_1.Blog.deleteOne({ _id: req.query.id });
        if (result.deletedCount === 1) {
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteBlog = deleteBlog;
const getSingleBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield blog_model_1.Blog.find({ _id: req.params.id });
        if (!product) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: product,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getSingleBlog = getSingleBlog;
const updateBlogInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, blogDetails } = req.body;
        yield blog_model_1.Blog.updateOne({ _id: id }, {
            $set: {
                title,
                blogDetails,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateBlogInfo = updateBlogInfo;
const updateBannerImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, updateImage } = req.body;
        yield blog_model_1.Blog.updateOne({ _id: id }, {
            $set: {
                img: updateImage,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateBannerImage = updateBannerImage;
// add comment in blog page
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentInfo = new blog_model_1.Comment(req.body);
        yield commentInfo.save();
        const updateComment = yield blog_model_1.Blog.updateOne({ _id: commentInfo.postId }, { $inc: { comment: 1 } });
        res.send({ message: "success", data: updateComment });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.createComment = createComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield blog_model_1.Comment.find({ postId: req.params.id }).sort({ date: -1 });
        if (!comments) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: comments,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getComment = getComment;
const getMyComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield blog_model_1.Comment.find({ email: req.query.email }).sort({ date: -1 });
        if (!comments) {
            return res.send({ message: "custom error" });
        }
        res.status(200).send({
            data: comments,
        });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.getMyComment = getMyComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.body;
        const result = yield blog_model_1.Comment.deleteOne({ _id: _id });
        if (result.deletedCount === 1) {
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "something is wrong" });
        }
    }
    catch (err) {
        res.send({ message: "Error occurred while deleting user history" });
    }
});
exports.deleteComment = deleteComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, comment } = req.body;
        yield blog_model_1.Comment.updateOne({ _id: id }, {
            $set: {
                comment
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateComment = updateComment;
