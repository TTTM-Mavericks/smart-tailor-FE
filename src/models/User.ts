export interface UserInterface {
    UserID: String,
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: number,
    Gender: boolean,
    Adddress: AddressInterface,
    Role: UserRoleInterface,
    Status: boolean
};

export interface AddressInterface {
    Description: String,
    District: String,
    Province: String,
}

export interface UserRoleInterface{
    RoleID: String,
    RoleName: String,
}