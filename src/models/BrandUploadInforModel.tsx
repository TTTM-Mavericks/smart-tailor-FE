export type Location = {
    Id: string;
    Name: string;
    Districts: District[];
};

export type District = {
    Id: string;
    Name: string;
    Wards: Ward[];
};

export type Ward = {
    Id: string;
    Name: string;
    Level?: string;
};

export interface Bank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    short_name: string;
    support: number;
    isTransfer: number;
    swift_code: string;
}

export interface FormData {
    // email: string;
    brandName: string;
    bankName: string;
    accountNumber: number;
    accountName: string;
    address: string;
    province: string,
    district: string,
    ward: string,
    qrPayment: string
}
