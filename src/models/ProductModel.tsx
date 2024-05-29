import { DesignInterface } from "./DesignModel";

export interface ProductInterface {
    product_id?: string; // UUID
    design_id?: string; // UUID
    brand_id?: string; // UUID
    product_name?: string; // String
    user_id?: string; // UUID
    price_per_product?: number; // Double
    gender?: boolean; // Boolean
    rating?: number; // Integer
    public_status?: boolean; // Boolean
    size?: string; // String
    create_date?: Date; // LocalDateTime
    last_modified_date?: Date; // LocalDateTime
    design?: DesignInterface
}
