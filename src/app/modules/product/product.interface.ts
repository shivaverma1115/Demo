export interface ProductType {
    categoryName: string;
    oldPrice: number;
    price: number;
    productDetails: string;
    productImages: string[];
    productName: string;
    productQuantity: number;
    subcategoryName: string;
    img: string;
    date:string;
    offer:boolean;
    offerPersent:number;
    rettings:number[];
    productStatus:string;
  }



  export interface formattedProductsType {
    productIds: string;
    totalValue: number;
    totalCardSum: number;
  }
  export interface offerProductType {
      productId:string;
      productName:string;
      banner: string;
      date:string;
      offerPersent:number;
      price: number;
      oldPrice:number;
      productDetails:string;
  }

