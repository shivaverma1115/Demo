import { Product } from "./../product/product.model";
import { Request, Response } from "express";
import { ContactInfo, RefundInfo, Reviews } from "./user-input.model";

export const createReview = async (req: Request, res: Response) => {
  try {
    const reviewInfo = new Reviews(req.body);
    await reviewInfo.save();
    const sendProdutReview = await Product.updateOne(
      { _id: reviewInfo.productId },
      { $push: { rettings: reviewInfo.retting } }
    );

    res.send({ message: "success", data: sendProdutReview });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getReview = async (req: Request, res: Response) => {
  try {
    const productId = req.query.id;
    const reviews = await Reviews.find({ productId: productId }).sort({
      date: -1,
    });
    res.send(reviews);
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
export const getAllReview = async (req: Request, res: Response) => {
  try {
    const reviews = await Reviews.find({}).sort({
      date: -1,
    });
    res.send(reviews);
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const getSingleReview = async (req: Request, res: Response) => {
  try {
    const review = await Reviews.find({ _id: req.params.id });
    if (!review) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: review,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const getUserReview = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const reviews = await Reviews.find({ email: email }).sort({ date: -1 });
    res.send(reviews);
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewInfo = req.body;
    const { _id, retting,productId } = reviewInfo;
    const result = await Reviews.deleteOne({ _id: _id });
    if (result.deletedCount === 1) {
      await Product.updateOne(
        { _id: productId },
        {
          $pull: {
            rettings: retting,
          },
        }
      );

      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error occurred while deleting user history" });
  }
};


export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewInfo = req.body;
    const { id, retting, productId, review, oldRatting } = reviewInfo;

    // Update the review in the Reviews collection
    const result = await Reviews.updateOne({ _id: id }, { $set: { retting, review } });

    if (result.matchedCount === 1) {
      // Update the specific element in the rettings array in the Product collection
      await Product.updateOne(
        { _id: productId },
        {
          $set: { 
            "rettings.$[element]": retting
          }
        },
        {
          arrayFilters: [
            { "element": oldRatting }
          ]
        }
      );

      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error occurred while updating the review" });
  }
};


// user contact 

export const createConatact = async (req: Request, res: Response) => {
  try {
    const contactdata = new ContactInfo(req.body);
    if(!contactdata){
       res.send({ message: "custom error" });
    }else{
      await contactdata.save();
      res.send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
export const createRefundRequest = async (req: Request, res: Response) => {
  try {
    const contactdata = new RefundInfo(req.body);
    if(!contactdata){
       res.send({ message: "custom error" });
    }else{
      await contactdata.save();
      res.send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const getSingleRefundInfo = async (req: Request, res: Response) => {
  try {
    const info = await RefundInfo.find({ _id: req.params.id });
    if (!info) {
      return res.send({ message: "custom error" });
    }
    res.status(200).send({
      data: info,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};


export const getContactInfo = async (req: Request, res: Response) => {
  try {
    const contactdata = await ContactInfo.find({})
    const revestData = contactdata.reverse()
     res.send(revestData)
  } catch (e) {
    res.send({ message: "custom error" });
  }
};
export const getRefundInfo = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await RefundInfo.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await RefundInfo.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getSearchRefund = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    
    let keywordArray: any = [];

    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery;
    }

    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
        { productId: { $regex: keyword, $options: "i" } },
        { date: { $regex: keyword, $options: "i" } },
        { paymentId: { $regex: keyword, $options: "i" } },
        { productName: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await RefundInfo.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
