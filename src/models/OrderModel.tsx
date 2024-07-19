import { DesignDetailInterface, DesignInterface } from "./DesignModel";

export interface PaymentInterface {
    paymentID: string; // UUID
    paymentSenderID: string; // UUID
    paymentSenderName: string;
    paymentSenderBankCode: string;
    paymentSenderBankNumber: string;
    paymentRecipientID: string;
    paymentRecipientName: string;
    paymentRecipientBankCode: string;
    paymentRecipientBankNumber: string;
    paymentAmount: number; // Double
    paymentMethod: string;
    paymentStatus: boolean;
    paymentType: string;
    createDate: string; // LocalDateTime
    lastModifiedDate: string; // LocalDateTime
}

export interface OrderInterface {
    orderID: string; // UUID
    parentOrderID?: string; // UUID
    designID: string; // UUID
    design?: DesignInterface;
    brandID?: string; // UUID
    quantity?: number; // Integer
    discountID?: string; // UUID
    orderStatus?: string;
    orderType?: string;
    address?: string;
    district?: string;
    province?: string;
    ward?: string;
    phone?: number; // Integer
    buyerName?: string;
    totalPrice?: number; // Double
    employeeID?: string; // UUID
    expectedStartDate?: string; // LocalDateTime
    expectedProductCompletionDate?: string; // LocalDateTime
    estimatedDeliveryDate: string; // LocalDateTime
    productionStartDate: string; // LocalDateTime
    productCompletionDate: string; // LocalDateTime
    createDate: string; // LocalDateTime
    lastModifiedDate: string; // LocalDateTime
    payment?: PaymentInterface[];
    designResponse?: DesignInterface
}

export interface OrderDetailInterface {
    discountResponse: any | null;
    district: string;
    estimatedDeliveryDate: string | null;
    expectedProductCompletionDate: string | null;
    expectedStartDate: string | null;
    orderID: string;
    orderStatus: string;
    orderType: string;
    parentOrderID: string | null;
    phone: string | null;
    productionCompletionDate: string | null;
    productionStartDate: string | null;
    province: string;
    quantity: number;
    totalPrice: number | null;
    ward: string;
    address: string;
    brandResponse: any | null;
    buyerName: string | null;
    designResponse: DesignInterface
}

export interface OrderRequestDetailInterface {
    design: DesignInterface,
    order: OrderDetailInterface,
    designDetail: DesignDetailInterface
  }



