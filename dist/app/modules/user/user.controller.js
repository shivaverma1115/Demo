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
exports.changePassword = exports.searchUser = exports.makeAdmin = exports.makeUser = exports.deleteUser = exports.getUserInfo = exports.updateUserInfo = exports.getRecentUsers = exports.getLoginUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
require("dotenv").config();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userinfo = req.body;
        const { name, email, password, role, phone, date, photo, gender } = userinfo;
        const enryptedpass = yield bcrypt_1.default.hash(password, 10);
        const alreayExist = yield user_model_1.User.findOne({ email: email });
        if (alreayExist) {
            res.send({ message: "User Is Alreay Exist" });
        }
        else {
            const user = new user_model_1.User({
                name,
                email,
                password: enryptedpass,
                role,
                phone,
                date,
                photo,
                gender,
            });
            yield user.save();
            res.status(200).send({ message: "success" });
        }
    }
    catch (e) {
        res.send({ message: "custome error" });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userinfo = req.body;
        const { email, password } = userinfo;
        const validuser = yield user_model_1.User.findOne({ email: email });
        if (validuser) {
            const validPass = yield bcrypt_1.default.compare(password, validuser.password);
            if (validPass) {
                const token = jsonwebtoken_1.default.sign({ email: validuser.email }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
                res.status(200).send({ message: "Login Successful", data: token });
            }
            else {
                res.send({ message: "password not Match" });
            }
        }
        else {
            res.send({ message: "user not Valid" });
        }
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.loginUser = loginUser;
const getLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const secretKey = process.env.JWT_SECRET || "fallbackSecret"; // Cast to Secret type
        const user = jsonwebtoken_1.default.verify(token, secretKey);
        const userEmail = user.email;
        const userdata = yield user_model_1.User.findOne({ email: userEmail }).select("-password");
        if (userdata) {
            res.status(200).send({ message: "Successful", data: userdata });
        }
        else {
            res.status(400).send({ message: "Not Valid User" });
        }
    }
    catch (e) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.getLoginUser = getLoginUser;
const getRecentUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentUser = yield user_model_1.User.find({})
            .select("-password -__v")
            .sort({ date: -1 })
            .limit(5);
        res.send(recentUser);
    }
    catch (e) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.getRecentUsers = getRecentUsers;
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, phone, photo: profilePic, gender } = req.body;
        yield user_model_1.User.updateOne({ _id: id }, {
            $set: {
                name,
                phone,
                photo: profilePic,
                gender,
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.updateUserInfo = updateUserInfo;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        const skip = (parsedPage - 1) * parsedLimit;
        const users = yield user_model_1.User.find({})
            .select("-orderProducts")
            .sort({ date: -1 })
            .skip(skip)
            .limit(parsedLimit);
        const totaluserCount = yield user_model_1.User.countDocuments();
        const totalPages = Math.ceil(totaluserCount / parsedLimit);
        res.status(200).send({
            users,
            totalPages,
            currentPage: parsedPage,
            totalProducts: totaluserCount,
        });
    }
    catch (e) {
        res.status(500).send({ message: "custom error" });
    }
});
exports.getUserInfo = getUserInfo;
// delete users
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.User.deleteOne({ _id: req.query.id });
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
exports.deleteUser = deleteUser;
// update user role
const makeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield user_model_1.User.updateOne({ _id: id }, {
            $set: {
                role: "user",
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.makeUser = makeUser;
const makeAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield user_model_1.User.updateOne({ _id: id }, {
            $set: {
                role: "admin",
            },
        });
        res.send({ message: "success" });
    }
    catch (e) {
        res.send({ message: "custom error" });
    }
});
exports.makeAdmin = makeAdmin;
// search user
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                { email: { $regex: keyword, $options: "i" } },
                { name: { $regex: keyword, $options: "i" } },
                { role: { $regex: keyword, $options: "i" } },
                { Phone: { $regex: keyword, $options: "i" } },
                { date: { $regex: keyword, $options: "i" } },
            ],
        }));
        const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
        const result = yield user_model_1.User.find(query).sort({ date: -1 });
        res.send(result);
    }
    catch (e) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.searchUser = searchUser;
// change password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.send({ message: 'User not found' });
        }
        // Check if the current password matches the one in the database
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.send({ message: 'Current password is incorrect' });
        }
        // Hash the new password
        const newPasswordHash = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the user's password in the database
        yield user_model_1.User.updateOne({ email }, { password: newPasswordHash });
        res.status(200).send({ message: 'Password changed successfully' });
    }
    catch (e) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
exports.changePassword = changePassword;
