import { Request, Response } from "express";
import { OffProduct, Product } from "./product.model";
import { Reviews } from "../user-input/user-input.model";
// import { Order } from "../OrderProduct/orderSuccess.model";
import { formattedProductsType } from "./product.interface";
import { UserReviewType } from "../user-input/user-input.interface";
import { SubCategory } from "../setting/setting.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productInfo = req.body;
    const { productName, categoryName, subcategoryName } = productInfo;
    const alreayExist = await Product.findOne({ productName: productName });
    if (alreayExist) {
      res.send({ message: "Already Exist" });
    } else {
      if (
        categoryName === "select any category" ||
        subcategoryName === "select any category"
      ) {
        res.send({ message: "category not selected" });
      } else {
        const newproduct = new Product(productInfo);
        await newproduct.save();
        res.status(200).send({ message: "success" });
      }
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const allProduct = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;

    // Updated query to filter products where productQuantity is greater than or equal to 1
    const products = await Product.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);

    const totalProductsCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);

    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};

export const getSinglePorduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.find({ _id: req.params.id });
    const rettings = await Reviews.aggregate([
      { $match: { productId: req.params.id, retting: { $gte: 1 } } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$retting" },
          totalCount: { $sum: 1 },
        },
      },
    ]);
    const avgRating = rettings.length > 0 ? rettings[0].averageRating : 0;
    const totalRettings = rettings.length > 0 ? rettings[0].totalCount : 0;
    const averageRating = parseFloat(avgRating.toFixed(1));

    const rettingsData = {
      rettings: totalRettings,
      averageRating: averageRating,
    };
    res.status(200).send({
      data: product,
      rettingsData,
    });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const updateBannerImage = async (req: Request, res: Response) => {
  try {
    const { id, updateImage } = req.body;
    await Product.updateOne(
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

export const updateProductInfo = async (req: Request, res: Response) => {
  try {
    const {
      id,
      productName,
      price,
      oldPrice,
      productQuantity,
      subcategoryName,
      categoryName,
      productDetails,
    } = req.body;
    await Product.updateOne(
      { _id: id },
      {
        $set: {
          productName,
          price,
          oldPrice,
          productQuantity,
          subcategoryName,
          categoryName,
          productDetails,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const updateMultipleImg = async (req: Request, res: Response) => {
  try {
    const { id, updateImages } = req.body;
    await Product.updateOne(
      { _id: id },
      {
        $addToSet: {
          productImages: {
            $each: updateImages,
          },
        },
      }
    );

    res.send({ message: "success", data: updateImages });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const deleteSingleImg = async (req: Request, res: Response) => {
  try {
    const { id, deletetImg } = req.body;
    await Product.updateOne(
      { _id: id },
      { $pull: { productImages: deletetImg } }
    );

    res.send({ message: "success", data: deletetImg });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      const exsistProduct = await OffProduct.findOne({
        productId: req.params.id,
      });
      if (exsistProduct) {
        const deleteOfferInfo = await OffProduct.deleteOne({
          productId: req.params.id,
        });
        if (deleteOfferInfo.deletedCount === 1) {
          res.send({ message: "success" });
        } else {
          res.send({ message: "something is wrong" });
        }
      }
    } else {
      res.send({ message: "success" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

export const getFiltredPorduct = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    let keywordArray: any = [];

    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery;
    }

    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [
        { categoryName: { $regex: keyword, $options: "i" } },
        { productName: { $regex: keyword, $options: "i" } },
        { subcategoryName: { $regex: keyword, $options: "i" } },
        { offerPercent: { $regex: keyword, $options: "i" } },
        { productStatus: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const products = await Product.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const OfferProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.find({ offer: true }).sort({ date: -1 });
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};
export const OfferProductBanner = async (req: Request, res: Response) => {
  try {
    const product = await OffProduct.find({}).sort({ date: -1 });
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};

export const TrendingProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});

    // Calculate average rating for each product and add it to the product object
    const productsWithAverageRating = products.map((product) => {
      const sum = product.rettings.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      );
      const rettingsLength = product.rettings.length;
      const averageRating = rettingsLength > 0 ? sum / rettingsLength : 0;

      return {
        ...product.toObject(),
        averageRating: parseFloat(averageRating.toFixed(1)),
        numRatings: rettingsLength,
      };
    });

    // Sort products by average rating and then by number of ratings
    const sortedProducts = productsWithAverageRating.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating; // Sort by average rating in descending order
      } else if (b.numRatings !== a.numRatings) {
        return b.numRatings - a.numRatings; // If average ratings are equal, sort by number of ratings in descending order
      } else {
        // If both average rating and numRatings are equal, keep the original order
        return 0;
      }
    });
    const top10Products = sortedProducts.slice(0, 10);

    res.status(200).send(top10Products);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error fetching products" });
  }
};

export const bestSellingProduct = async (req: Request, res: Response) => {
  try {
    const pipeline: any[] = [
      { $unwind: "$orderProducts" },
      {
        $group: {
          _id: "$orderProducts.productName",
          totalValue: {
            $sum: {
              $multiply: ["$orderProducts.totalCard", "$orderProducts.price"],
            },
          },
          totalCardSum: { $sum: "$orderProducts.totalCard" },
          productIds: { $addToSet: "$orderProducts._id" },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 12 },
    ];
    // const bestSoldProducts = await Order.aggregate(pipeline);

    // const formattedProducts: formattedProductsType[] = bestSoldProducts.map(
    //   (product) => {
    //     const productId: string = product.productIds[0];
    //     return {
    //       productIds: productId,
    //       totalValue: product.totalValue,
    //       totalCardSum: product.totalCardSum,
    //     };
    //   }
    // );

    // const productIds = formattedProducts.map((product) => product.productIds);
    // const products = await Product.find({ _id: { $in: productIds } });
    // const orderedProducts = formattedProducts.map((formattedProduct) =>
    //   products.find(
    //     (product) => product._id.toString() === formattedProduct.productIds
    //   )
    // );
    res.status(200).send('orderedProducts');
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const newArrival = async (req: Request, res: Response) => {
  try {
    const product = await Product.find({}).sort({ date: -1 });
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};
export const Review = async (req: Request, res: Response) => {
  try {
    const reviews = await Reviews.find({}).sort({ retting: -1, date: -1 });
    const uniqueEmailReviews: { [email: string]: UserReviewType } = {};

    reviews.forEach((review) => {
      const email = review.email;
      if (
        !uniqueEmailReviews[email] ||
        review.retting > uniqueEmailReviews[email].retting
      ) {
        uniqueEmailReviews[email] = review;
      }
    });
    const uniqueReviews = Object.values(uniqueEmailReviews);
    res.status(200).send(uniqueReviews);
  } catch (e) {
    res.status(500).send({ message: "Error fetching reviews" });
  }
};

export const Rattings = async (req: Request, res: Response) => {
  try {
    const ratting = await Reviews.find({}, { retting: 1 }).sort({
      retting: -1,
      date: -1,
    });

    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    ratting.forEach((review) => {
      if (review.retting in counts) {
        counts[review.retting]++;
      }
    });

    const resultArray = Object.entries(counts).map(([key, value]) => ({
      retting: parseInt(key),
      totalRatting: value,
    }));
    const reversedArray = resultArray.reverse();
    res.status(200).send(reversedArray);
  } catch (e) {
    res.status(500).send({ message: "Error fetching reviews" });
  }
};

export const createOffer = async (req: Request, res: Response) => {
  try {
    const productInfo = req.body;
    const { productId, offerPersent, banner, price, oldPrice } = productInfo;
    const alreadyExist = await OffProduct.findOne({ productId });
    if (alreadyExist) {
      await OffProduct.updateOne(
        { productId: productId },
        { offerPersent, banner, price, oldPrice }
      );
      await Product.updateOne(
        { _id: productId },
        { offerPersent, offer: true, price, oldPrice }
      );
    } else {
      const newProduct = new OffProduct(productInfo);
      await newProduct.save();
      await Product.updateOne(
        { _id: productId },
        { offerPersent, offer: true, price, oldPrice }
      );
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOfferProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const offerProduct = await OffProduct.findOne({ productId: id });

    res.status(200).json({ message: "success", data: offerProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const allOfferProduct = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await OffProduct.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await OffProduct.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};

// delete offer product

export const deleteOfferProduct = async (req: Request, res: Response) => {
  try {
    const SingleOfferProduct = await OffProduct.findOne({ _id: req.params.id });
    const result = await OffProduct.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      await Product.updateOne(
        { _id: SingleOfferProduct?.productId },
        {
          offerPersent: 0,
          offer: false,
          price: SingleOfferProduct?.oldPrice,
          oldPrice: 0,
        }
      );
      res.status(200).send({ message: "success" });
    } else {
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

// search

export const searchOfferProducts = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    let keywordArray: any = [];

    if (searchQuery && typeof searchQuery === "string") {
      keywordArray = searchQuery.split(",");
    } else if (Array.isArray(searchQuery)) {
      keywordArray = searchQuery;
    }

    const keywordFilter = keywordArray.map((keyword: string) => ({
      $or: [{ productName: { $regex: keyword, $options: "i" } }],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await OffProduct.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// product search from admin pannel

export const getFiltredPorductFromAdmin = async (
  req: Request,
  res: Response
) => {
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
        { categoryName: { $regex: keyword, $options: "i" } },
        { productName: { $regex: keyword, $options: "i" } },
        { subcategoryName: { $regex: keyword, $options: "i" } },
        { offerPercent: { $regex: keyword, $options: "i" } },
        { productStatus: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await Product.find(query);
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// update offer banner

export const updateOfferBannerImage = async (req: Request, res: Response) => {
  try {
    const { id, updateImage } = req.body;
    await OffProduct.updateOne(
      { _id: id },
      {
        $set: {
          banner: updateImage,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};



// get product brand or subcategory wize

export const getSubCategoryWizeProducts = async (req: Request,res: Response) => {
  try {
    const id = req.params.id;
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const data = await SubCategory.findOne({ _id: id });
    const subCategory = data?.subCategoryName;
    const products = await Product.find({ subcategoryName: subCategory })
    .sort({ date: -1 })
    .skip(skip)
    .limit(parsedLimit);
  const totalProductsCount = await Product.countDocuments();
  const totalPages = Math.ceil(totalProductsCount / parsedLimit);

  if(!products.length){
    res.status(400).send({message:"Product Not Available"})
  }

  res.status(200).send({
    products,
    totalPages,
    currentPage: parsedPage,
    totalProducts: totalProductsCount,
  });

  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

 