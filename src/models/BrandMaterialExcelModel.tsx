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
    Unit: string,
    Price: number,
    HS_Code: number,
    Base_Price: number,
    Brand_Price: number
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

export interface AddMaterial {
    brandName: string,
    categoryName: string,
    materialName: string,
    hsCode: number,
    unit: string,
    basePrice: number,
    brandPrice: number
}

export interface UpdateMaterial {
    brandName: string,
    categoryName: string,
    materialName: string,
    hsCode: number,
    unit: string,
    basePrice: number,
    brandPrice: number
}

export interface AddExcelMultiple {
    categoryName: string;
    materialName: string;
    hsCode: number;
    unit: string;
    basePrice: number;
    brandPrice: number
}