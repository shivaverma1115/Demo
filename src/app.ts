import express, { Application } from "express";
import cors from "cors";
import UserRouter from "./app/modules/user/user.route";
import SettingsRouter from "./app/modules/setting/setting.route";
import productRoute from "./app/modules/product/product.route";
import userInputRoute from "./app/modules/user-input/user-input.route";
import PaymentRoute from "./app/modules/payment/payment.route";
import paymentSuccess from "./app/modules/OrderProduct/orderSuccess.route";
import blogRoute from "./app/modules/blog/blog.route";
import teamRoute from "./app/modules/team/team.route";
const app: Application = express();

// cors
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/user", UserRouter);
app.use("/setting", SettingsRouter);
app.use("/product", productRoute);
app.use("/user-input", userInputRoute);
app.use("/payment", PaymentRoute);
app.use("/success", paymentSuccess);
app.use("/blog", blogRoute);
app.use("/team", teamRoute);

export default app;
