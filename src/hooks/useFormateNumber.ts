export function formatNumber(number:any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}