export interface ExcelData {
    expertTailoringID: string,
    expertTailoringName: string,
    sizeImageUrl: string,
    error: boolean,
    Expert_Tailoring_Name: string,
    Size_Image_Url: string,
}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface ExpertTailoring {
    expertTailoringID: string,
    expertTailoringName: string,
    sizeImageUrl: string,
    status: boolean,
    createDate: string,
    lastModifiedDate: string
}

export interface ExpertTailoringEdit {
    expertTailoringID: string,
    expertTailoringName: string,
    sizeImageUrl: string
}