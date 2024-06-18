export interface ExcelData {
    id: number,
    categoryName: string,
    materialName: string,
    price: number,
    unit: string,
    hsCode: string,
    error: boolean,
    Category_Name: string,
    Material_Name: string,
    Unit: String,
    Price: number,
    HS_Code: number,
    Base_Price: number
}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface Material {
    id: number,
    categoryName: string,
    materialName: string,
    price: number,
    unit: string,
    hsCode: number
}