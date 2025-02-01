import { Request, Response } from "express";
import { Blog, Comment } from "./blog.model";

export const createBlog = async (req: Request, res: Response) => {
  try {
    const productInfo = req.body;
    const { title } = productInfo;
    const alreayExist = await Blog.findOne({ title: title });
    if (alreayExist) {
      res.send({ message: "Already Exist" });
    } else {
      const newproduct = new Blog(productInfo);
      await newproduct.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const allBlogs = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const blogs = await Blog.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const blogCount = await Blog.countDocuments();
    const totalPages = Math.ceil(blogCount / parsedLimit);
    res.status(200).send({
      blogs,
      totalPages,
      currentPage: parsedPage,
      blogCount,
    });
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};

export const searchBlogs = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    let keywordArray: any = [];

    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery;
    }

    const keywordFilter = keywordArray.map((keyword:string) => ({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } },
        { blogDetails: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await Blog.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const result = await Blog.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

export const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const product = await Blog.find({ _id: req.params.id });
    if (!product) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: product,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const updateBlogInfo = async (req: Request, res: Response) => {
  try {
    const { id, title, blogDetails } = req.body;
    await Blog.updateOne(
      { _id: id },
      {
        $set: {
          title,
          blogDetails,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const updateBannerImage = async (req: Request, res: Response) => {
  try {
    const { id, updateImage } = req.body;
    await Blog.updateOne(
      { _id: id },
      {
        $set: {
          img: updateImage,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// add comment in blog page

export const createComment = async (req: Request, res: Response) => {
  try {
    const commentInfo = new Comment(req.body);
    await commentInfo.save();
    const updateComment = await Blog.updateOne(
      { _id: commentInfo.postId },
      { $inc: { comment: 1 } }
    );

    res.send({ message: "success", data: updateComment });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({date:-1})
    if (!comments) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: comments,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
export const getMyComment = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ email: req.query.email }).sort({date:-1})
    if (!comments) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: comments,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  try {
    const {_id} = req.body
    const result = await Comment.deleteOne({ _id: _id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id, comment } = req.body;
    await Comment.updateOne(
      { _id: id },
      {
        $set: {
          comment
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

