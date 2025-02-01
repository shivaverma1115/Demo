export interface ShipMentStatus {
  orderStatusDate?: string;
  shipmentStatus?: string;
}

export interface OrderDataType {
  buyerEmail: string | undefined;
  name: string;
  Address: string;
  City: string;
  Postcode: string;
  EmailAddress: string;
  date: string;
  orderStatusDate: string;
  Phone: string;
  totalPrice: number;
  orderProducts?: any;
  paymentId?: string;
  shipmentStatus: string;
  orderId?: string;
  shipmentStatusArray: ShipMentStatus[] | undefined;
}

export interface CanceOrderDataType {
  buyerEmail: string | undefined;
  EmailAddress: string;
  date: string;
  Phone: string;
  productId: string;
  productName: string;
  returnAmount:number;
  paymentId: string;
  orderId?: string;
  returnStatus: string;
  orderProduct:any;
}
