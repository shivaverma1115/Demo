import { model, Schema } from "mongoose";
import { CanceOrderDataType, OrderDataType, ShipMentStatus } from "./orderSuccess.interface";

const ShipMentStatusScema = new Schema<ShipMentStatus>({
  orderStatusDate:String,
  shipmentStatus: String,
})  

const orderScema = new Schema<OrderDataType>({
  buyerEmail: String,
  name: String,
  Address: String,
  City: String,
  Postcode: String,
  EmailAddress: String,
  date: String,
  orderStatusDate: String,
  Phone: String,
  totalPrice: Number,
  orderProducts: Array,
  paymentId: String,
  shipmentStatus: String,
  orderId: String,
  shipmentStatusArray:{type:[ShipMentStatusScema] ||  undefined}
});
const cancelOrderScema = new Schema<CanceOrderDataType>({
  buyerEmail: String,
  EmailAddress: String,
  date: String,
  Phone: String,
  productId: String,
  productName: String,
  returnAmount: Number,
  paymentId: String,
  orderId: String,
  returnStatus: String,
  orderProduct:Object,
});


export const Order = model<OrderDataType>("Order", orderScema);
export const CancelOrder = model<OrderDataType>("CancelOrder", cancelOrderScema);