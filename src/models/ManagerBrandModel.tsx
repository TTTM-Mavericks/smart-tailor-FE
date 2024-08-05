export interface Brand {
    brandID: string,
    brandName: string,
    brandStatus: string,
    rating: number,
    bankName: string,
    actionTaken: boolean;
    user: User,
    createDate: string
}

export interface User {
    userID: string,
    email: string,
    fullName: string,
    language: string,
    phoneNumber: number,
    provider: string,
    userStatus: string,
    roleName: string,
    imageUrl: string,
}

export interface EditBrand {
    userID: string,
    email: string,
    fullName: string,
    language: string,
    phoneNumber: number,
    provider: string,
    userStatus: string,
    roleName: string,
    imageUrl: string,
}