export interface ExcelData {
    expertTailoringName: string,
    sizeName: string,
    minFabric: number,
    maxFabric: number,
    unit: string,
    error: boolean,
    Expert_Tailoring_Name: string,
    Size_Name: string,
    Min_Fabric: number,
    Max_Fabric: number,
    Unit: string,
}

export interface DuplicateCheckResponse {
    hasDuplicates: boolean;
    duplicates: ExcelData[];
}

export interface SizeExpertTailoring {
    expertTailoringName: string,
    sizeName: string,
    minFabric: number,
    maxFabric: number,
    unit: string,
    status: boolean,
    createDate: string,
    lastModifiedDate: string
}

export interface SizeExpertTailoringEdit {
    expertTailoringID: string,
    expertTailoringName: string,
    sizeName: string,
    minFabric: number,
    maxFabric: number,
    unit: string
}

export interface AddSizeExpertTailoring {
    expertTailoringName: string,
    sizeName: string,
    minFabric: number,
    maxFabric: number,
    unit: string
}
