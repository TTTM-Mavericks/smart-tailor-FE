export interface ExcelData {
    id: number,
    materialID: string,
    categoryName: string,
    materialName: string,
    price: number,
    unit: string,
    hsCode: number,
    error: boolean,
    Category_Name: string,
    Material_Name: string,
    Unit: string,
    Price: number,
    HS_Code: number,
    Base_Price: number,
    basePrice: number,
    status: boolean
}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface Material {
    materialID: string,
    categoryName: string,
    materialName: string,
    unit: string,
    hsCode: number,
    basePrice: number,
}

export interface AddMaterial {
    categoryName: string,
    materialName: string,
    unit: string,
    hsCode: number,
    basePrice: number,
}

export interface AddExcelMaterial {
    categoryName: string,
    materialName: string,
    unit: string,
    hsCode: number,
    basePrice: number,
}