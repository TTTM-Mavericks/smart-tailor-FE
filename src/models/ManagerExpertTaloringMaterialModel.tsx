export interface ExcelData {
    expertTailoringID: string,
    expertTailoringName: string,
    sizeImageUrl: string,
    error: boolean,
    Category_Name: string,
    Material_Name: string,
    Expert_Tailoring_Name: string[]
}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface ExpertTailoringMaterial {
    expertTailoringID: string,
    categoryName: string,
    materialName: string,
    expertTailoringName: string,
    createDate: string,
    lastModifiedDate: string
}

export interface ExpertTailoringMaterialEdit {
    expertTailoringID: string,
    categoryName: string,
    materialName: string,
    expertTailoringNames: string[],
}

export interface AddExpertTailoringMaterial {
    categoryName: string,
    materialName: string,
    expertTailoringNames: string[]
}
