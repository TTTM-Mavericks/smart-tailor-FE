export interface Report {
    reportID: string;
    typeOfReport: string;
    orderResponse: OrderResponse;
    content: string,
    reportStatus: string,
    reportImageList: ReportImageList,
    createDate: string,
    lastModifiedDate: string
}

export interface OrderResponse {
    orderID: string,
    parentOrderID: string,
    quantity: number,
    orderStatus: string,
    orderType: string,
    address: string,
    province: string,
    district: string,
    ward: string,
    phone: number,
    buyerName: string,
    totalPrice: number,
    expectedStartDate: string,
    expectedProductCompletionDate: string,
    estimatedDeliveryDate: string,
    productionStartDate: string,
    productionCompletionDate: string,
    detailList: DetailList[],
    paymentList: string
}

export interface DetailList {
    designDetailId: string,
    quantity: number,
    size: SIZE,
    detailStatus: boolean
}

export interface SIZE {
    sizeID: string,
    sizeName: string,
    status: boolean,
    createDate: string,
    lastModifiedDate: string
}

export interface ReportImageList {
    reportImageID: string,
    reportImageName: string,
    reportImageUrl: string,
    createDate: string,
    lastModifiedDate: string
}