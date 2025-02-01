import express from "express";
import {
  SavePaymentInfo,
  acceptCancelOrders,
  bestCategoryProduct,
  bestSellingProduct,
  cancelOrders,
  clientOrders,
  clientOrdersInfo,
  clientPaymentInfo,
  getAllCancelOrders,
  getAllCancelOrdersHistory,
  getClient,
  getClientInfo,
  getSpacificUserCancelData,
  getTrackOrder,
  getpurchaseClientInfo,
  orderInfo,
  searchCancelOrders,
  searchCancelOrdersPending,
  searchClientProduct,
  searchClients,
  sellSummary,
  updateShipmentStatus,
} from "./orderSuccess.controller";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";

const paymentSuccess = express.Router();
// all Routes
paymentSuccess.post("/save-payment-info", verifyToken, SavePaymentInfo);
paymentSuccess.get("/sell-summaries", sellSummary);
paymentSuccess.get("/best-category-chart", bestCategoryProduct);
paymentSuccess.get("/clients", getClient);
paymentSuccess.get("/best-selling-products", bestSellingProduct);
paymentSuccess.get("/percess-client-info", getpurchaseClientInfo);
paymentSuccess.get("/orders", orderInfo);
paymentSuccess.get("/clientInfo", getClientInfo);
paymentSuccess.get("/search-clients", searchClients);
paymentSuccess.get("/search-cancel-orders", searchCancelOrders);
paymentSuccess.get("/search-cancel-orders-pending", searchCancelOrdersPending);
paymentSuccess.get("/client-order/:id", clientOrders);
paymentSuccess.get("/track-order/:id", getTrackOrder);
paymentSuccess.get("/client-order-track/:id", clientOrders);
paymentSuccess.get("/client-product", searchClientProduct);
paymentSuccess.get("/client-order-info", clientOrdersInfo);
paymentSuccess.get("/payment-info", clientPaymentInfo);
paymentSuccess.get("/cancel-orders", getAllCancelOrders);
paymentSuccess.get("/cancel-orders-history", getAllCancelOrdersHistory);
paymentSuccess.get("/single-user-cancel-orders", getSpacificUserCancelData);
paymentSuccess.put(
  "/update-shipment-status",
  adminVerify,
  updateShipmentStatus
);
paymentSuccess.put("/accept-cancel-order", adminVerify, acceptCancelOrders);
paymentSuccess.put("/client-order-cencel", verifyToken, cancelOrders);

export default paymentSuccess;
