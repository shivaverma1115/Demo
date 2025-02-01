import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../app/modules/user/user.model';

const adminVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).send({ message: "JWT Authorization Header Missing" });
    }
    const token = authorization.split(" ")[1];
    const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`) as { email: string };
    const { email } = decoded;
    const validAdmin = await User.findOne({ email });
   
    if (!validAdmin) {
        return res.status(403).send({ message: "JWT Authorization Header Missing" });
      }
    if (email === req.query.email && validAdmin?.role === "admin") {
      next();
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return next("Private Api");
  }
};

export default adminVerify;
