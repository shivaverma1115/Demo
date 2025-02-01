import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(403).send({ message: "JWT Authorization Header Missing" });
    }

    const token = authorization.split(" ")[1];
    const decoded = await jwt.verify(token, `${process.env.JWT_SECRET}`) as { email: string };
    const { email } = decoded;

    if (email === req.query.email) {
      next();
    } else {
      return res.status(403).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return next("Private Api");
  }
};

export default verifyToken;
