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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../app/modules/user/user.model");
const adminVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(403).send({ message: "JWT Authorization Header Missing" });
        }
        const token = authorization.split(" ")[1];
        const decoded = yield jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        const { email } = decoded;
        const validAdmin = yield user_model_1.User.findOne({ email });
        if (!validAdmin) {
            return res.status(403).send({ message: "JWT Authorization Header Missing" });
        }
        if (email === req.query.email && (validAdmin === null || validAdmin === void 0 ? void 0 : validAdmin.role) === "admin") {
            next();
        }
        else {
            return res.status(403).send({ message: "Unauthorized" });
        }
    }
    catch (err) {
        return next("Private Api");
    }
});
exports.default = adminVerify;
