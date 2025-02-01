"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userVerify_1 = __importDefault(require("../../../middleware/userVerify"));
const user_input_controller_1 = require("./user-input.controller");
const express_1 = __importDefault(require("express"));
const userInputRoute = express_1.default.Router();
// all Routes
userInputRoute.post("/add-review", userVerify_1.default, user_input_controller_1.createReview);
userInputRoute.post("/contact", user_input_controller_1.createConatact);
userInputRoute.post("/refund-request", user_input_controller_1.createRefundRequest);
userInputRoute.get("/reviews", user_input_controller_1.getReview);
userInputRoute.get("/client-review", user_input_controller_1.getUserReview);
userInputRoute.get("/all-review", user_input_controller_1.getAllReview);
userInputRoute.get("/review/:id", user_input_controller_1.getSingleReview);
userInputRoute.get("/contact-info", user_input_controller_1.getContactInfo);
userInputRoute.get("/refund-info", user_input_controller_1.getRefundInfo);
userInputRoute.get("/refund-info/:id", user_input_controller_1.getSingleRefundInfo);
userInputRoute.get("/search-refund", user_input_controller_1.getSearchRefund);
userInputRoute.put("/update-review", userVerify_1.default, user_input_controller_1.updateReview);
userInputRoute.delete("/delete-review", userVerify_1.default, user_input_controller_1.deleteReview);
exports.default = userInputRoute;
