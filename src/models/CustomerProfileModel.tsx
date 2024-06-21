export interface CustomerProfile {
    email: string,
    fullName: string,
    phoneNumber: string,
    imageUrl: string,
    gender: boolean,
    dateOfBirth: Date,
    address: string,
    province: string,
    district: string,
    ward: string
}

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
