export const DesignTool: String = 'stampsItem' || 'colorPicker' || 'filePicker' || ' downloadTool' 

export interface SystemPropertyInterface {
    propertyID: string;
    propertyName: string;
    propertyUnit: string;
    propertyDetail: string;
    propertyType: string;
    propertyValue: string;
    propertyStatus: boolean;
}
