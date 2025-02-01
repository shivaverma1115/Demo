import verifyToken from '../../../middleware/userVerify';
import { createConatact, createRefundRequest, createReview, deleteReview, getAllReview, getContactInfo, getRefundInfo, getReview, getSearchRefund, getSingleRefundInfo, getSingleReview, getUserReview, updateReview } from './user-input.controller';
import express from "express";

const userInputRoute = express.Router();
// all Routes
userInputRoute.post("/add-review",verifyToken, createReview);
userInputRoute.post("/contact", createConatact);
userInputRoute.post("/refund-request", createRefundRequest);
 
userInputRoute.get("/reviews", getReview);
userInputRoute.get("/client-review", getUserReview);
userInputRoute.get("/all-review", getAllReview);
userInputRoute.get("/review/:id", getSingleReview);
userInputRoute.get("/contact-info", getContactInfo);
userInputRoute.get("/refund-info", getRefundInfo);
userInputRoute.get("/refund-info/:id", getSingleRefundInfo);
userInputRoute.get("/search-refund", getSearchRefund);

userInputRoute.put("/update-review", verifyToken, updateReview);

userInputRoute.delete("/delete-review", verifyToken, deleteReview);


export default userInputRoute;
   