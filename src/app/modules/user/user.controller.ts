import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { User } from "./user.model";
require("dotenv").config();

export const createUser = async (req: Request, res: Response) => {
  try {
    const userinfo = req.body;
    const { name, email, password, role, phone, date, photo, gender } =
      userinfo;
    const enryptedpass = await bcrypt.hash(password, 10);
    const alreayExist = await User.findOne({ email: email });
    if (alreayExist) {
      res.send({ message: "User Is Alreay Exist" });
    } else {
      const user = new User({
        name,
        email,
        password: enryptedpass,
        role,
        phone,
        date,
        photo,
        gender,
      });

      await user.save();
      res.status(200).send({ message: "success" });
    }
  } catch (e) {
    res.send({ message: "custome error" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const userinfo = req.body;
    const { email, password } = userinfo;
    const validuser = await User.findOne({ email: email });

    if (validuser) {
      const validPass = await bcrypt.compare(password, validuser.password);

      if (validPass) {
        const token = jwt.sign(
          { email: validuser.email },
          `${process.env.JWT_SECRET}`,
          { expiresIn: "1d" }
        );
        res.status(200).send({ message: "Login Successful", data: token });
      } else {
        res.send({ message: "password not Match" });
      }
    } else {
      res.send({ message: "user not Valid" });
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const secretKey: Secret = process.env.JWT_SECRET || "fallbackSecret"; // Cast to Secret type
    const user = jwt.verify(token, secretKey) as { email: string };
    const userEmail = user.email;
    const userdata = await User.findOne({ email: userEmail }).select(
      "-password"
    );

    if (userdata) {
      res.status(200).send({ message: "Successful", data: userdata });
    } else {
      res.status(400).send({ message: "Not Valid User" });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getRecentUsers = async (req: Request, res: Response) => {
  try {
    const recentUser = await User.find({})
      .select("-password -__v")
      .sort({ date: -1 })
      .limit(5);

    res.send(recentUser);
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { id, name, phone, photo: profilePic, gender } = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          name,
          phone,
          photo: profilePic,
          gender,
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const users = await User.find({})
      .select("-orderProducts")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totaluserCount = await User.countDocuments();
    const totalPages = Math.ceil(totaluserCount / parsedLimit);
    res.status(200).send({
      users,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totaluserCount,
    });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

// delete users

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await User.deleteOne({ _id: req.query.id });
    if (result.deletedCount === 1) {
      res.send({ message: "success" });
    } else {
      res.send({ message: "something is wrong" });
    }
  } catch (err) {
    res.send({ message: "Error occurred while deleting user history" });
  }
};

// update user role

export const makeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          role: "user",
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

export const makeAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await User.updateOne(
      { _id: id },
      {
        $set: {
          role: "admin",
        },
      }
    );

    res.send({ message: "success" });
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// search user

export const searchUser = async (req: Request, res: Response) => {
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
        { email: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
        { role: { $regex: keyword, $options: "i" } },
        { Phone: { $regex: keyword, $options: "i" } },
        { date: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await User.find(query).sort({ date: -1 });
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ message: 'User not found' });
    }

    // Check if the current password matches the one in the database
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.send({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.updateOne({ email }, { password: newPasswordHash });

    res.status(200).send({ message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
