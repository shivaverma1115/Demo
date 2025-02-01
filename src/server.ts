import mongoose from "mongoose";
import app from "./app";
const port = process.env.PORT || 5000;

require("dotenv").config();
// conncet with mongodb atlas
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qbmtaop.mongodb.net/orgado`;
const mongooseOptions: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Set a longer timeout (default is 30000)
};

async function mongodbConnect() {
  try {
    await mongoose.connect(mongoUrl, mongooseOptions);
    console.log("databes connected");
    app.get("/", (req, res) => {
      res.send("Website is running");
    });
    app.listen(port, () => {
      console.log(` app listening on port ${port}`);
    });
  } catch (e) {
    console.log("server err", e);
  }
}

mongodbConnect();
