import moment from "moment";

export function getFilterData(products:any,last7Days:any,currentDate:any) {
    const last7DaysData = products.filter((item:any) => {
        const orderDate = moment(item.orderDate, "MM/DD/YY h:mm a");
        return orderDate.isBetween(last7Days, currentDate, "day", "[]"); // Include both start and end dates
      });

      return last7DaysData
}


export function getSellsItems(todayData: any) {
    const sellsItems = todayData.reduce((sum: number, product: any) => {
        return sum + product.totalCard;
    }, 0);

    return sellsItems;
}

export function getSells(todayData: any) {
    const sells = todayData.reduce((sum: number, product: any) => {
        return sum + product.price * product.totalCard;
    }, 0);

    return sells; // Added return statement
}


