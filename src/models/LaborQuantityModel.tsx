export interface LaborQuantity {
    laborQuantityID: string;
    laborQuantityMinQuantity: number;
    laborQuantityMaxQuantity: number;
    laborQuantityMinPrice: number;
    laborQuantityMaxPrice: number;
    brandLaborCostPerQuantity?: number;
}