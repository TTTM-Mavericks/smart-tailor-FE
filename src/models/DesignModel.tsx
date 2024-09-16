import { shirtBackDesign, shirtFrontDesign } from "../assets";
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, SLEEVE_CLOTH_PART } from "./ClothModel";
import { UserInterface } from "./UserModel";


export interface MaterialCategoryInterface {
  categoryID: string,
  categoryName: string,
  createDate: string,
  lastModifiedDate: string
}
export interface ItemMaskInterface {
  itemMaskID: any;
  partOfDesignID?: any;
  itemMaskName?: string;
  typeOfItem?: string;
  positionX?: number,
  positionY?: number,
  position?: { x: number, y: number };
  scaleX?: number;
  scaleY?: number;
  createDate?: string;
  lastModifiedDate?: string;
  imageUrl: string;
  isSystemItem?: boolean;
  isPremium?: boolean;
  zIndex?: any;
  printType?: string,
  rotate?: any;
  itemMaterial?: ItemMaterialInterface,
  materialID?: string
  indexZ?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;


}

export interface PartOfDesignInterface {
  partOfDesignID?: any;
  designID?: any;
  partOfDesignName?: any;
  createDate?: string;
  lastModifiedDate?: string;
  imageUrl?: string;
  successImageUrl?: string;
  itemMasks?: ItemMaskInterface[];
  materialID?: any;
  width?: number,
  height?: number,
  material?: MaterialInterface;
  realpartImageUrl?: string;
}

export interface DesignInterface {
  designID?: any;
  userID?: any;
  user?: UserInterface;
  expertTailoringName?: string;
  titleDesign?: string;
  publicStatus?: boolean;
  createDate?: string;
  lastModifiedDate?: string;
  partOfDesign?: PartOfDesignInterface[];
  typeOfDesign?: string;
  imageUrl?: string;
  color?: string;
  expertTailoringID?: string;
  expertTailoring?: ExpertTailoringInterface;
  materialDetail?: MaterialDetailInterface[];
  minWeight?: number,
  maxWeight?: number,

}

export interface MaterialDetailInterface {
  materialResponse?: MaterialInterface,
  minPrice?: number;
  maxPrice?: number;
  quantity?: number;
  basePrice?: number,
  brandPrice?: number,
}

export interface DesignDetailInterface {
  designDetailId?: any;
  quantity?: number;
  size?: SizeInterface;
  detailStatus?: boolean

}

export interface ItemMaterialInterface {
  itemMaterialID?: any;
  materialID?: any;
  createDate?: string;
  lastModifiedDate?: string;

}

export interface MaterialInterface {
  materialID: string;
  materialName: string;
  categoryName: string;
  hsCode: number;
  unit: string;
  basePrice: number;
  status: boolean;
  createDate: string;
  lastModifiedDate: string | null;
  minPrice?: number,
  maxPrice?: number
}

export interface ExpertTailoringInterface {
  expertTailoringID: string;
  expertTailoringName: string;
  sizeImageUrl: string;
  status: boolean;
  createDate: string;
  lastModifiedDate: string;
  modelImageUrl: string;
}


export interface ExpertTailoringSizeInterface {
  expertTailoringID: string;
  expertTailoringName: string;
  sizeID: string;
  sizeName: string;
  minFabric: number;
  maxFabric: number;
  unit: string;
  createDate: string;
  lastModifiedDate: string | null;
  quantity?: number;
  designDetailId?: any;
}

export interface SizeInterface {
  sizeID: string;
  sizeName: string;
  createDate: string;
  lastModifiedDate: string | null;
  status?: boolean
}




export const PartOfShirtDesignData: PartOfDesignInterface[] = [
  {
    partOfDesignID: '1',
    designID: '1',
    partOfDesignName: LOGO_PART,
    createDate: '',
    lastModifiedDate: '',
    imageUrl: shirtFrontDesign,
    successImageUrl: '',
    itemMasks: [],

  },
  {
    partOfDesignID: '2',
    designID: '1',
    partOfDesignName: FRONT_CLOTH_PART,
    createDate: '',
    lastModifiedDate: '',
    imageUrl: shirtFrontDesign,
    itemMasks: [],
  },
  {
    partOfDesignID: '3',
    designID: '1',
    partOfDesignName: BACK_CLOTH_PART,
    createDate: '',
    lastModifiedDate: '',
    imageUrl: shirtBackDesign,
    itemMasks: [],
  },
  {
    partOfDesignID: '4',
    designID: '1',
    partOfDesignName: SLEEVE_CLOTH_PART,
    createDate: '',
    lastModifiedDate: '',
    imageUrl: shirtFrontDesign,
    itemMasks: [],
  },

]

export const PartOfHoodieDesignData = [
  {
    partOfDesignName: "LOGO_PART",
    imageUrl: "/src/assets/clothes/shirt-front-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "FRONT_CLOTH_PART",
    imageUrl: "/src/assets/clothes/shirt-front-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "BACK_CLOTH_PART",
    imageUrl: "/src/assets/clothes/shirt-back-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "SLEEVE_CLOTH_PART",
    imageUrl: "/src/assets/clothes/seleeve_hoodie.png",
    successImageUrl: "",
    materialID: "",
    width: 15,
    height: 20,
    itemMask: []
  }
]

export const PartOfLongSkirtData = [
  {
    partOfDesignName: "LOGO_PART",
    imageUrl: "/src/assets/clothes/shirt-front-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "FRONT_CLOTH_PART",
    imageUrl: "/src/assets/clothes/shirt-front-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "BACK_CLOTH_PART",
    imageUrl: "/src/assets/clothes/shirt-back-design.png",
    successImageUrl: "",
    materialID: "",
    width: 60,
    height: 80,
    itemMask: []
  },
  {
    partOfDesignName: "SLEEVE_CLOTH_PART",
    imageUrl: "/src/assets/clothes/long_shirt.png",
    successImageUrl: "",
    materialID: "",
    width: 15,
    height: 20,
    itemMask: []
  }
]



const ItemMaskDataList = [
  {
    "partOfDesignID": "partOfDesignID 1",
    "itemMaskName": "itemMaskName 1",
    "typeOfItem": "typeOfItem 1",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/qij6j79rp1bysj9yr2w4.png",
    "print_type": "print_type 1",
    "createDate": 1717587142,
    "lastModifiedDate": 1717587142,
    "zIndex": 80,
    "itemMaskID": "1"
  },
  {
    "partOfDesignID": "partOfDesignID 2",
    "itemMaskName": "itemMaskName 2",
    "typeOfItem": "typeOfItem 2",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/ksq4ukq6y7rrqphhargb.png",
    "print_type": "print_type 2",
    "createDate": 1717587082,
    "lastModifiedDate": 1717587082,
    "zIndex": 70,
    "itemMaskID": "2"
  },
  {
    "partOfDesignID": "partOfDesignID 3",
    "itemMaskName": "itemMaskName 3",
    "typeOfItem": "typeOfItem 3",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/fykmp5kljkkxhbjss3xb.png",
    "print_type": "print_type 3",
    "createDate": 1717587022,
    "lastModifiedDate": 1717587022,
    "zIndex": 3,
    "itemMaskID": "3"
  },
  {
    "partOfDesignID": "partOfDesignID 4",
    "itemMaskName": "itemMaskName 4",
    "typeOfItem": "typeOfItem 4",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/hqojko4jozfrdcarsgd8.png",
    "print_type": "print_type 4",
    "createDate": 1717586962,
    "lastModifiedDate": 1717586962,
    "zIndex": 26,
    "itemMaskID": "4"
  },
  {
    "partOfDesignID": "partOfDesignID 5",
    "itemMaskName": "itemMaskName 5",
    "typeOfItem": "typeOfItem 5",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717427241/system-item/reqfjzswqaeayc3k1pj5.jpg",
    "print_type": "print_type 5",
    "createDate": 1717586902,
    "lastModifiedDate": 1717586902,
    "zIndex": 88,
    "itemMaskID": "5"
  },
  {
    "partOfDesignID": "partOfDesignID 6",
    "itemMaskName": "itemMaskName 6",
    "typeOfItem": "typeOfItem 6",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "imageUrl 6",
    "print_type": "print_type 6",
    "createDate": 1717586842,
    "lastModifiedDate": 1717586842,
    "zIndex": 48,
    "itemMaskID": "6"
  },
  {
    "partOfDesignID": "partOfDesignID 7",
    "itemMaskName": "itemMaskName 7",
    "typeOfItem": "typeOfItem 7",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "imageUrl 7",
    "print_type": "print_type 7",
    "createDate": 1717586782,
    "lastModifiedDate": 1717586782,
    "zIndex": 82,
    "itemMaskID": "7"
  },
  {
    "partOfDesignID": "partOfDesignID 8",
    "itemMaskName": "itemMaskName 8",
    "typeOfItem": "typeOfItem 8",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "imageUrl 8",
    "print_type": "print_type 8",
    "createDate": 1717586722,
    "lastModifiedDate": 1717586722,
    "zIndex": 42,
    "itemMaskID": "8"
  },
  {
    "partOfDesignID": "partOfDesignID 9",
    "itemMaskName": "itemMaskName 9",
    "typeOfItem": "typeOfItem 9",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 150,
      "y": 170
    },
    "scaleX": 230,
    "scaleY": 230,
    "imageUrl": "imageUrl 9",
    "print_type": "print_type 9",
    "createDate": 1717586662,
    "lastModifiedDate": 1717586662,
    "zIndex": 82,
    "itemMaskID": "9"
  },
  {
    "partOfDesignID": "partOfDesignID 10",
    "itemMaskName": "itemMaskName 10",
    "typeOfItem": "typeOfItem 10",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 45,
    "scaleY": 75,
    "imageUrl": "imageUrl 10",
    "print_type": "print_type 10",
    "createDate": 1717586602,
    "lastModifiedDate": 1717586602,
    "zIndex": 18,
    "itemMaskID": "10"
  },
  {
    "partOfDesignID": "partOfDesignID 11",
    "itemMaskName": "itemMaskName 11",
    "typeOfItem": "typeOfItem 11",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 84,
    "scaleY": 6,
    "imageUrl": "imageUrl 11",
    "print_type": "print_type 11",
    "createDate": 1717586542,
    "lastModifiedDate": 1717586542,
    "zIndex": 10,
    "itemMaskID": "11"
  },
  {
    "partOfDesignID": "partOfDesignID 12",
    "itemMaskName": "itemMaskName 12",
    "typeOfItem": "typeOfItem 12",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 78,
    "scaleY": 72,
    "imageUrl": "imageUrl 12",
    "print_type": "print_type 12",
    "createDate": 1717586482,
    "lastModifiedDate": 1717586482,
    "zIndex": 18,
    "itemMaskID": "12"
  },
  {
    "partOfDesignID": "partOfDesignID 13",
    "itemMaskName": "itemMaskName 13",
    "typeOfItem": "typeOfItem 13",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 8,
    "scaleY": 26,
    "imageUrl": "imageUrl 13",
    "print_type": "print_type 13",
    "createDate": 1717586422,
    "lastModifiedDate": 1717586422,
    "zIndex": 64,
    "itemMaskID": "13"
  },
  {
    "partOfDesignID": "partOfDesignID 14",
    "itemMaskName": "itemMaskName 14",
    "typeOfItem": "typeOfItem 14",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 21,
    "scaleY": 23,
    "imageUrl": "imageUrl 14",
    "print_type": "print_type 14",
    "createDate": 1717586362,
    "lastModifiedDate": 1717586362,
    "zIndex": 22,
    "itemMaskID": "14"
  },
  {
    "partOfDesignID": "partOfDesignID 15",
    "itemMaskName": "itemMaskName 15",
    "typeOfItem": "typeOfItem 15",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 86,
    "scaleY": 69,
    "imageUrl": "imageUrl 15",
    "print_type": "print_type 15",
    "createDate": 1717586302,
    "lastModifiedDate": 1717586302,
    "zIndex": 76,
    "itemMaskID": "15"
  },
  {
    "partOfDesignID": "partOfDesignID 16",
    "itemMaskName": "itemMaskName 16",
    "typeOfItem": "typeOfItem 16",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 51,
    "scaleY": 70,
    "imageUrl": "imageUrl 16",
    "print_type": "print_type 16",
    "createDate": 1717586242,
    "lastModifiedDate": 1717586242,
    "zIndex": 55,
    "itemMaskID": "16"
  },
  {
    "partOfDesignID": "partOfDesignID 17",
    "itemMaskName": "itemMaskName 17",
    "typeOfItem": "typeOfItem 17",
    "isSystemItem": false,
    "isPremium": false,
    "position": {
      "x": 0,
      "y": 0
    },
    "scaleX": 41,
    "scaleY": 72,
    "imageUrl": "imageUrl 17",
    "print_type": "print_type 17",
    "createDate": 1717586182,
    "lastModifiedDate": 1717586182,
    "zIndex": 40,
    "itemMaskID": "17"
  }
]