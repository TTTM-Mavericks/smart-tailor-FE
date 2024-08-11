export interface UserInterface {
  avatar?: string;
  email: string;
  fullName: string;
  language: string | null;
  phoneNumber: string;
  provider: string;
  roleName: string;
  userID: string;
  userStatus: boolean;
  imageUrl?: string
}

export interface BrandInterface {
  brandID: string;
  user: UserInterface;
  brandName: string;
  brandStatus: string;
  rating: number;
  numberOfRatings: number;
  totalRatingScore: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  numberOfViolations: number;
  createDate: string;
  lastModifiedDate: string | null;
  images: string[];
  qr_Payment: string;
}
