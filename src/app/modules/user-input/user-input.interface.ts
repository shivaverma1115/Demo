export interface UserReviewType {
  productName:string;
  review: string;
  name: string;
  email: string;
  date: string;
  productId: string;
  categoryName: string;
  retting: number;
  img:string;
}


export interface UserContactType {
  name: string;
  email: string;
  phone: string;
  message: string;
  date:string;
}
export interface UserReturnRequestType {
  name: string;
  email: string;
  phone: string;
  message: string;
  productId: string;
  date:string
  paymentId: string;
  productName: string;
}
