export interface ExcelData {
    categoryID: string,
    error: boolean,

}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface Category {
    categoryID: string,
    categoryName: string
}

export interface AddCategory {
    categoryNames: string
}