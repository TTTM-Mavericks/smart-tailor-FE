export interface PayOSResponseDataInterface {
    bin: string;
    accountNumber: string;
    accountName: string;
    currency: string;
    paymentLinkId: string;
    amount: number;
    description: string;
    orderCode: number;
    status: string;
    checkoutUrl: string;
    qrCode: string;
    id?: any,
    createdAt?: string
}

export interface PayOSResponseInterface {
    code: string;
    desc: string;
    data: PayOSResponseDataInterface;
    signature: string;
}

export interface PaymentOrderInterface {
    paymentID: string;
    paymentSenderID: string | null;
    paymentSenderName: string;
    paymentSenderBankCode: string;
    paymentSenderBankNumber: string;
    paymentRecipientID: string | null;
    paymentRecipientName: string;
    paymentRecipientBankCode: string;
    paymentRecipientBankNumber: string;
    paymentAmount: number;
    paymentMethod: string | null;
    paymentStatus: boolean;
    paymentType: string;
    orderID: string;
    payOSResponse: PayOSResponseInterface;
    paymentURl?: string
}
