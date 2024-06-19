export interface UserInterface {
    avatar?: string;
    email: string;
    fullName: string;
    language: string | null;
    phoneNumber: string | null;
    provider: string;
    roleName: string;
    userID: string;
    userStatus: boolean;
    imageUrl?: string
  }
