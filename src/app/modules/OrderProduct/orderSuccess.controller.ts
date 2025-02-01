import { formatNumber } from "../../../hooks/useFormateNumber";
import {
  getFilterData,
  getSells,
  getSellsItems,
} from "../../../hooks/useGetFilterData";
import { Product } from "../product/product.model";
import { CancelOrder, Order } from "./orderSuccess.model";
import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
export const SavePaymentInfo = async (req: Request, res: Response) => {
  try {
    const paymentInfo = req.body;
    const orderId = uuidv4();
    paymentInfo.orderId = orderId;
    const newInfo = new Order(paymentInfo);
    await newInfo.save();
    const products = paymentInfo.orderProducts;
    products.forEach(async (productId: any) => {
      const result = await Product.updateMany(
        { _id: productId?._id },
        { $inc: { productQuantity: -productId?.totalCard } }
      );
    });

    res.send({ message: "success", orderId });
  } catch (e) {
    res.send({ message: "custome error" });
  }
};

export const sellSummary = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({});
    const rowproducts = orders.flatMap((order) => order.orderProducts);
    const products = rowproducts.reverse();
    const currentDate = moment();
    const last7Days = moment().subtract(7, "days");
    const last30Days = moment().subtract(30, "days");
    const last1Year = moment().subtract(365, "days");

    const todayData = products.filter((item) => {
      const orderDate = moment(item.orderDate, "MM/DD/YY h:mm a");
      return orderDate.isSame(currentDate, "day");
    });

    const last7DaysData = getFilterData(products, last7Days, currentDate);
    const last30DaysData = getFilterData(products, last30Days, currentDate);
    const last1YearData = getFilterData(products, last1Year, currentDate);

    // sellsItems

    const todaySellsItem = getSellsItems(todayData);
    const todaySells = getSells(todayData);
    const last7DaySellsItem = getSellsItems(last7DaysData);
    const last7DaySells = getSells(last7DaysData);
    const last30DaysSellsItem = getSellsItems(last30DaysData);
    const last30DaysSells = getSells(last30DaysData);
    const last1YearSellsItem = getSellsItems(last1YearData);
    const last1YearSells = getSells(last1YearData);
    const totalSellsItem = getSellsItems(products);
    const totalSells = getSells(products);

    const todaysSells = formatNumber(todaySells);
    const lastSevenDaysSells = formatNumber(last7DaySells);
    const lastThirtyDaysSells = formatNumber(last30DaysSells);
    const lastOneYearSells = formatNumber(last1YearSells);
    const lifeTimeSells = formatNumber(totalSells);

    const dates = last30DaysData.map(
      (item: any) => item.orderDate.split(" ")[0]
    );
    const uniqueDatesSet = new Set(dates);
    const uniqueDatesArray = Array.from(uniqueDatesSet).toString().split(",");

    const formattedDates = uniqueDatesArray.map((dateString) => {
      const [month, day, year] = dateString.split("/");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const formattedDate = `${parseInt(day, 10)} ${
        monthNames[parseInt(month, 10) - 1]
      }`;
      return formattedDate;
    });

    formattedDates.sort((a, b) => {
      const dateA: any = new Date(a);
      const dateB: any = new Date(b);
      return dateA - dateB;
    });

    interface DailySalesEntry {
      date: string;
      totalSales: number;
    }

    const dailySalesArray: DailySalesEntry[] = last30DaysData.reduce(
      (accumulator: any, item: any) => {
        const date = item.orderDate.split(" ")[0];
        const sales = item.price * item.totalCard;

        const existingIndex = accumulator.findIndex(
          (entry: any) => entry.date === date
        );
        if (existingIndex !== -1) {
          accumulator[existingIndex].totalSales += sales;
        } else {
          accumulator.push({ date, totalSales: sales });
        }

        return accumulator;
      },
      []
    );

    dailySalesArray.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sellsReport = dailySalesArray.map((entry) => entry.totalSales);

    // daily sold product quantity

    const dailySoldProduct: DailySalesEntry[] = last30DaysData.reduce(
      (accumulator: any, item: any) => {
        const date = item.orderDate.split(" ")[0];
        const totalproduct = item.totalCard;

        const existingIndex = accumulator.findIndex(
          (entry: any) => entry.date === date
        );
        if (existingIndex !== -1) {
          accumulator[existingIndex].totalCard += totalproduct;
        } else {
          accumulator.push({ date, totalCard: totalproduct });
        }

        return accumulator;
      },
      []
    );

    dailySoldProduct.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const productQuantity = dailySoldProduct.map((item: any) => item.totalCard);

    const recentProduct = last7DaysData.slice(0, 5);

    const filteredData = {
      // total sells amount
      todaysSells,
      lastSevenDaysSells,
      lastThirtyDaysSells,
      lastOneYearSells,
      lifeTimeSells,
      // sels item number
      todaySellsItem,
      last7DaySellsItem,
      last30DaysSellsItem,
      last1YearSellsItem,
      totalSellsItem,
      last30DaysSells,
      // data
      recentProduct,

      sellsReport,
      productQuantity,
      formattedDates,
    };
    res.send(filteredData);
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).select(
      "buyerEmail totalPrice name Phone"
    );
    const recentClients = orders.reverse();

    res.send({ message: "success", clients: recentClients });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const bestCategoryProduct = async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $unwind: "$orderProducts",
      },
      {
        $group: {
          _id: "$orderProducts.categoryName",
          products: {
            $push: {
              productName: "$orderProducts.productName",
              totalCard: "$orderProducts.totalCard",
            },
          },
        },
      },
    ];
    const categoryCounts = await Order.aggregate(pipeline);

    const transformedCategoryProducts = categoryCounts.map((category) => ({
      category: category._id,
      sells: category.products.reduce(
        (totalSells: number, product: any) => totalSells + product.totalCard,
        0
      ),
    }));

    const categories = transformedCategoryProducts.map((item) => item.category);
    const sells = transformedCategoryProducts.map((item) => item.sells);

    res.send({ message: "success", categories, sells });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const bestSellingProduct = async (req: Request, res: Response) => {
  try {
    const pipeline: any[] = [
      { $unwind: "$orderProducts" },
      {
        $group: {
          _id: "$orderProducts.productName",
          totalValue: {
            $sum: {
              $multiply: ["$orderProducts.totalCard", "$orderProducts.price"],
            },
          },
          totalCardSum: { $sum: "$orderProducts.totalCard" },
          productIds: { $addToSet: "$orderProducts._id" },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 5 },
    ];

    const bestSoldProducts = await Order.aggregate(pipeline);

    const formattedProducts = bestSoldProducts.map((product) => ({
      productName: product._id,
      totalValue: product.totalValue,
      totalCardSum: product.totalCardSum,
      productId: product.productIds[0],
    }));

    res.send(formattedProducts);
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const getpurchaseClientInfo = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ buyerEmail: req.query.email });
    const orderInfo = orders.reverse();
    const clientOrders = orderInfo.flatMap((item) => item.orderProducts);

    // Get unique objects based on _id
    const uniqueClientOrders: any = Array.from(
      new Set(clientOrders.map((item) => item._id))
    ).map((id) => clientOrders.find((item) => item._id === id));
    res.send({ message: "success", clients: uniqueClientOrders });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};

export const orderInfo = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;

    const orders = await Order.find({});
    const allProducts = orders.flatMap((order) => order.orderProducts);
    allProducts.sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    const startIndex = skip;
    const endIndex = Math.min(skip + parsedLimit, allProducts.length);
    const productIdsForPage = allProducts
      .slice(startIndex, endIndex)
      .map((product) => product._id);
    const products = await Product.find({ _id: { $in: productIdsForPage } });

    const totalProductsCount = allProducts.length;
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);

    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};
export const getClientInfo = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await Order.find({})
      .select("-orderProducts")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await Order.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "custom error" });
  }
};


export const searchClients = async (req: Request, res: Response) => {
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
        { buyerEmail: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
        { paymentId: { $regex: keyword, $options: "i" } },
        { Phone: { $regex: keyword, $options: "i" } },
        { date: { $regex: keyword, $options: "i" } },
        { shipmentStatus: { $regex: keyword, $options: "i" } },
        { orderId: { $regex: keyword, $options: "i" } },
      ],
    }));

    const query = keywordFilter.length > 0 ? { $or: keywordFilter } : {};
    const result = await Order.find(query).sort({ date: -1 });
    res.send(result);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const clientOrders = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Validate id format (example: check if it's a valid ObjectId for MongoDB)
    if (!id) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    const products = await Order.find({ _id: id }).sort({ date: -1 });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ error: "No products found for the given ID" });
    }

    res.status(200).send({
      products,
    });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const searchClientProduct = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search; // Convert search query to lowercase
    const id = req.query.id;

    // Find the order based on the provided id
    const result: any = await Order.findOne({ _id: id });

    if (!result) {
      // If the order is not found, send an appropriate response
      return res.status(404).send({ message: "Order not found" });
    }
    const myArray = result.orderProducts;

    // Search for a product within myArray based on lowercase searchQuery
    const foundProducts = myArray.filter((product: any) =>
      product.productName.toLowerCase().includes(searchQuery)
    );

    if (foundProducts.length === 0) {
      return res
        .status(404)
        .send({ message: "Product not found in the order" });
    }

    res.send(foundProducts);
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const clientOrdersInfo = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await Order.find({ buyerEmail: email }).sort({ date: -1 });

    // Create a Set to store unique product IDs
    const uniqueProductIds = new Set();

    // Iterate through each order and its products
    products.forEach((order) => {
      order.orderProducts.forEach((product: any) => {
        // Add the product's "_id" to the Set
        uniqueProductIds.add(product._id);
      });
    });

    // Convert the Set back to an array
    const uniqueProducts = Array.from(uniqueProductIds);

    // Fetch full product details for each unique product ID
    const orderProduct = await Product.find({ _id: { $in: uniqueProducts } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await Product.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      orderProduct,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export const clientPaymentInfo = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const products = await Order.find({ buyerEmail: email }).sort({ date: -1 });
    res.status(200).send({ message: "success", data: products });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateShipmentStatus = async (req: Request, res: Response) => {
  try {
    const { id, shipmentStatus, orderStatusDate, paymentId, orderId } =
      req.body;
    const shipmentInfo = {
      shipmentStatus,
      orderStatusDate,
      paymentId,
      orderId,
    };

    const orderData = await Order.findOne({ _id: id });
    const isExist = orderData?.shipmentStatusArray?.find(
      (item) => item.shipmentStatus == shipmentStatus
    );
    if (isExist) {
      res.send({
        message: "duplicate error",
        data: `Already ${isExist?.shipmentStatus}`,
      });
    } else {
      const result = await Order.updateOne(
        { _id: id },
        {
          $set: {
            shipmentStatus,
            orderStatusDate,
          },
          $addToSet: { shipmentStatusArray: { $each: [shipmentInfo] } },
        }
      );

      if (result.modifiedCount == 1) {
        res.send({ message: "success", result });
      } else {
        res.send({ message: "error" });
      }
    }
  } catch (e) {
    res.send({ message: "custom error" });
  }
};

// cencel order

export const cancelOrders = async (req: Request, res: Response) => {
  try {
    const cancelData = req.body;
    const {
      id,
      buyerEmail,
      EmailAddress,
      orderProduct,
      date,
      Phone,
      paymentId,
      orderId,
    } = cancelData;
    const ClientOrder = await Order.findOne({ _id: cancelData?.id });
    if (ClientOrder?.paymentId && ClientOrder?.shipmentStatus === "pending") {
      const cancelOrder = new CancelOrder({
        buyerEmail,
        EmailAddress,
        date,
        Phone,
        productId: id,
        productName: orderProduct?.productName,
        returnAmount: orderProduct?.price * orderProduct?.totalCard,
        paymentId,
        orderId,
        returnStatus: "pending",
        orderProduct,
      });

      const saveData = await cancelOrder.save();
      if (saveData) {
        const result = await Order.updateOne(
          { _id: ClientOrder?.id },
          {
            $pull: { orderProducts: { _id: cancelData?.orderProduct?._id } },
          }
        );

        if (result.modifiedCount === 1) {
          const isEmpthy = await Order.findOne({ _id: ClientOrder?.id });
          if (isEmpthy?.orderProducts?.length === 0) {
            const result = await Order.updateOne(
              { _id: ClientOrder?.id },
              {
                $set: { shipmentStatus: "order cancelled" },
              }
            );
          }
          res.send({ message: "Order Canceled" });
        } else {
          res.send({ message: "Payment Id Not Match" });
        }
      }
    } else {
      res.send({ message: "Payment Id Not Found" });
    }
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// accept cancel order

export const getAllCancelOrders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await CancelOrder.find({ returnStatus: "pending" })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await CancelOrder.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};

export const searchCancelOrders = async (req: Request, res: Response) => {
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
        { buyerEmail: { $regex: keyword, $options: "i" } },
        { productName: { $regex: keyword, $options: "i" } },
        { EmailAddress: { $regex: keyword, $options: "i" } },
        { date: { $regex: keyword, $options: "i" } },
        { orderId: { $regex: keyword, $options: "i" } },
      ],
      returnStatus: "approved", //
    }));

    const query = {
      $and: [
        { $or: keywordFilter.length > 0 ? keywordFilter : [{}] },
        { returnStatus: "approved" },
      ],
    };

    const result = await CancelOrder.find(query).sort({ date: -1 });

    res.send({ message: "success", data: result });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};



// 
export const searchCancelOrdersPending = async (req: Request, res: Response) => {
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
        { buyerEmail: { $regex: keyword, $options: "i" } },
        { productName: { $regex: keyword, $options: "i" } },
        { EmailAddress: { $regex: keyword, $options: "i" } },
        { date: { $regex: keyword, $options: "i" } },
         
      ],
      returnStatus: "pending",
    }));

    const query = {
      $and: [
        { $or: keywordFilter.length > 0 ? keywordFilter : [{}] },
        { returnStatus: "pending" },
      ],
    };

    const result = await CancelOrder.find(query).sort({ date: -1 });

    res.send({ message: "success", data: result });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// 

export const acceptCancelOrders = async (req: Request, res: Response) => {
  try {
    const cancelInfo = req.body;
    const { id, productId, returnAmount } = cancelInfo;

    const data = await CancelOrder.findOne({ _id: id });
    if (data?.paymentId) {
      const result = await CancelOrder.updateOne(
        { _id: id },
        {
          $set: {
            returnStatus: "approved",
          },
        }
      );
      // delete data

      if (result.modifiedCount == 1) {
        const oldObject = await Order.findOne({ _id: productId });
        await Order.updateOne(
          { _id: productId },
          {
            $set: {
              totalPrice: (oldObject?.totalPrice as number) - returnAmount,
            },
          }
        );
        res.send({ message: "success" });
      } else {
        res.send({ message: "something is wrong" });
      }
    }
  } catch (e) {
    res.send({ message: "something is wrong" });
  }
};

export const getSpacificUserCancelData = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.query;
    const result = await CancelOrder.find({ buyerEmail: email });
    if (result.length) {
      res.send({ message: "success", data: result });
    } else {
      res.status(404).send({ message: "Data Not Found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};
export const getTrackOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    // Validate id format (example: check if it's a valid ObjectId for MongoDB)
    if (!orderId) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    const products = await Order.findOne({ orderId: orderId });

    if (!products || products?.orderProducts?.length === 0) {
      res.send({ message: "No products found for the given ID" });
    } else {
      res.send({ message: "success", data: [products] });
    }
  } catch (e) {
    res.send({ message: "Internal Server Error" });
  }
};

export const getAllCancelOrdersHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { page, limit } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await CancelOrder.find({
      returnStatus: { $ne: "pending" },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parsedLimit);
    const totalProductsCount = await CancelOrder.countDocuments();
    const totalPages = Math.ceil(totalProductsCount / parsedLimit);
    res.status(200).send({
      products,
      totalPages,
      currentPage: parsedPage,
      totalProducts: totalProductsCount,
    });
  } catch (e) {
    res.status(500).send({ message: "Error fetching products" });
  }
};
