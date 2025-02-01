import express from "express";
import {
  OfferProduct,
  OfferProductBanner,
  Rattings,
  Review,
  TrendingProduct,
  allOfferProduct,
  allProduct,
  bestSellingProduct,
  createOffer,
  createProduct,
  deleteOfferProduct,
  deleteProduct,
  deleteSingleImg,
  getFiltredPorduct,
  getFiltredPorductFromAdmin,
  getOfferProduct,
  getSinglePorduct,
  getSubCategoryWizeProducts,
  newArrival,
  searchOfferProducts,
  updateBannerImage,
  updateMultipleImg,
  updateOfferBannerImage,
  updateProductInfo,
} from "./product.controller";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";

const productRoute = express.Router();
// all Routes
productRoute.post("/create-product", adminVerify, createProduct);
productRoute.post("/create-offer", adminVerify, createOffer);

productRoute.get("/all-products", allProduct);
productRoute.get("/search-products", getFiltredPorduct);
productRoute.get("/search-products-admin", getFiltredPorductFromAdmin);
productRoute.get("/single-products/:id", getSinglePorduct);
productRoute.get("/offer-products/:id", getOfferProduct);

productRoute.get("/offer-products", OfferProduct);
productRoute.get("/offer-products-banner", OfferProductBanner);
productRoute.get("/search-offer-products", searchOfferProducts);

productRoute.get("/all-offer-products", allOfferProduct);
productRoute.get("/trending-products", TrendingProduct);
productRoute.get("/best-selling-products", bestSellingProduct);
productRoute.get("/new-arrival", newArrival);
productRoute.get("/best-reviews", Review);
productRoute.get("/rattings", Rattings);
productRoute.get("/sub-categorywise-product/:id", getSubCategoryWizeProducts);

productRoute.put("/update-banner", adminVerify, updateBannerImage);
productRoute.put("/update-offer-banner", adminVerify, updateOfferBannerImage);
productRoute.put("/delete-slider-img", adminVerify, deleteSingleImg);
productRoute.put("/update-product-info", adminVerify, updateProductInfo);
productRoute.put("/update-multiple-img", adminVerify, updateMultipleImg);
productRoute.delete("/delete-product/:id", adminVerify, deleteProduct);
productRoute.delete("/delete-offer-product/:id", adminVerify, deleteOfferProduct);

export default productRoute;
