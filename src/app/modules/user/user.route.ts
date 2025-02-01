import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getLoginUser,
  getRecentUsers,
  getUserInfo,
  loginUser,
  makeAdmin,
  makeUser,
  searchUser,
  updateUserInfo,
} from "./user.controller";
import verifyToken from "../../../middleware/userVerify";
import adminVerify from "../../../middleware/adminVerify";
const UserRouter = express.Router();
UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/get-user", getLoginUser);
UserRouter.get("/recent-user", getRecentUsers);
UserRouter.get("/users-info",verifyToken, getUserInfo);
UserRouter.get("/search-users", adminVerify, searchUser);
UserRouter.put("/update-user", verifyToken, updateUserInfo);
UserRouter.put("/make-user", adminVerify, makeUser);
UserRouter.put("/make-admin", adminVerify, makeAdmin);
UserRouter.put("/change-password", verifyToken, changePassword);

UserRouter.delete("/delete-user", adminVerify, deleteUser);

export default UserRouter;
