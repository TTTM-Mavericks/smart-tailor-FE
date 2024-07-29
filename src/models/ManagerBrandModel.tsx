export interface Brand {
    userID: string,
    email: string,
    fullName: string,
    language: string,
    phoneNumber: number,
    provider: string,
    userStatus: string,
    roleName: string,
    imageUrl: string,
    actionTaken: boolean;
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