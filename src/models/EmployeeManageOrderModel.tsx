export interface EmployeeOrder {
    orderID: string,
    parentOrderID: string,
    quantity: number,
    orderStatus: string,
    orderType: string,
    address: string,
    province: string,
    district: string,
    ward: string,
    phone: string,
    buyerName: string,
    totalPrice: number,
    expectedStartDate: string,
    expectedProductCompletionDate: string,
    estimatedDeliveryDate: string,
    productionStartDate: string,
    productionCompletionDate: string,
    detailList: DetailList[],
    paymentList: string,
    createDate: string,
    orderImageList: ImageList
}

export interface DetailList {
    designDetailId: string,
    quantity: number,
    size: Size
    detailStatus: boolean
}

export interface Size {
    sizeID: string,
    sizeName: string,
    status: boolean,
    createDate: string,
    lastModifiedDate: string,
}

export interface ImageList {
    orderImageID: string,
    orderImageName: string,
    orderImageUrl: string,
    createDate: string,
    lastModifiedDate: string
}