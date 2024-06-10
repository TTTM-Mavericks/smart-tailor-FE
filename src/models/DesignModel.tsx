import { frontOfCloth } from "../assets";
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, SLEEVE_CLOTH_PART } from "./ClothModel";

export interface ItemMaskInterface {
    item_mask_id: string; // UUID
    part_of_design_id?: string; // UUID
    item_mask_name?: string; // Enum?: String
    type_of_item?: string; // String
    position_x?: number,
    position_y?: number,
    position?: { x: number, y: number };
    scale_x?: number; // Float
    scale_y?: number; // Float
    create_date?: string; // LocalDateTime
    last_modified_date?: string; // LocalDateTime
    image_url: string;
    isSystemItem?: boolean;
    isPremium?: boolean;
    z_index?: any;


}

export interface PartOfDesignInterface {
    part_of_design_id?: any; // UUID
    design_id?: any; // UUID
    part_name?: any; // Enum?: String
    create_date?: string; // LocalDateTime
    last_modified_date?: string; // LocalDateTime
    img_url: string;
    item_mask?: ItemMaskInterface[];
}

export interface DesignInterface {
    design_id?: any; // UUID
    user_id?: any; // UUID
    expert_tailoring_name?: string; // String
    title_design?: string; // String
    public_status?: boolean; // Boolean
    create_date?: string; // LocalDateTime
    last_modified_date?: string; // LocalDateTime
    part_of_item?: PartOfDesignInterface[];
    type_of_design?: string;
}


export const PartOfShirtDesignData = [
    {
        part_of_design_id: '1',
        design_id: '1',
        part_name: LOGO_PART,
        create_date: '',
        last_modified_date: '',
        img_url: frontOfCloth,
        item_mask: [],

    },
    {
        part_of_design_id: '2',
        design_id: '1',
        part_name: FRONT_CLOTH_PART,
        create_date: '',
        last_modified_date: '',
        img_url: frontOfCloth,
        item_mask: [],
    },
    {
        part_of_design_id: '3',
        design_id: '1',
        part_name: BACK_CLOTH_PART,
        create_date: '',
        last_modified_date: '',
        img_url: frontOfCloth,
        item_mask: [],
    },
    {
        part_of_design_id: '4',
        design_id: '1',
        part_name: SLEEVE_CLOTH_PART,
        create_date: '',
        last_modified_date: '',
        img_url: frontOfCloth,
        item_mask: [],
    },

]

const ItemMaskDataList = [
    {
      "part_of_design_id": "part_of_design_id 1",
      "item_mask_name": "item_mask_name 1",
      "type_of_item": "type_of_item 1",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/qij6j79rp1bysj9yr2w4.png",
      "print_type": "print_type 1",
      "create_date": 1717587142,
      "last_modified_date": 1717587142,
      "z_index": 80,
      "item_mask_id": "1"
    },
    {
      "part_of_design_id": "part_of_design_id 2",
      "item_mask_name": "item_mask_name 2",
      "type_of_item": "type_of_item 2",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 19,
      "scale_y": 6,
      "image_url": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/ksq4ukq6y7rrqphhargb.png",
      "print_type": "print_type 2",
      "create_date": 1717587082,
      "last_modified_date": 1717587082,
      "z_index": 70,
      "item_mask_id": "2"
    },
    {
      "part_of_design_id": "part_of_design_id 3",
      "item_mask_name": "item_mask_name 3",
      "type_of_item": "type_of_item 3",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/fykmp5kljkkxhbjss3xb.png",
      "print_type": "print_type 3",
      "create_date": 1717587022,
      "last_modified_date": 1717587022,
      "z_index": 3,
      "item_mask_id": "3"
    },
    {
      "part_of_design_id": "part_of_design_id 4",
      "item_mask_name": "item_mask_name 4",
      "type_of_item": "type_of_item 4",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717753160/system-item/hqojko4jozfrdcarsgd8.png",
      "print_type": "print_type 4",
      "create_date": 1717586962,
      "last_modified_date": 1717586962,
      "z_index": 26,
      "item_mask_id": "4"
    },
    {
      "part_of_design_id": "part_of_design_id 5",
      "item_mask_name": "item_mask_name 5",
      "type_of_item": "type_of_item 5",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "https://res.cloudinary.com/dby2saqmn/image/upload/v1717427241/system-item/reqfjzswqaeayc3k1pj5.jpg",
      "print_type": "print_type 5",
      "create_date": 1717586902,
      "last_modified_date": 1717586902,
      "z_index": 88,
      "item_mask_id": "5"
    },
    {
      "part_of_design_id": "part_of_design_id 6",
      "item_mask_name": "item_mask_name 6",
      "type_of_item": "type_of_item 6",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "image_url 6",
      "print_type": "print_type 6",
      "create_date": 1717586842,
      "last_modified_date": 1717586842,
      "z_index": 48,
      "item_mask_id": "6"
    },
    {
      "part_of_design_id": "part_of_design_id 7",
      "item_mask_name": "item_mask_name 7",
      "type_of_item": "type_of_item 7",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 230,
      "scale_y": 230,
      "image_url": "image_url 7",
      "print_type": "print_type 7",
      "create_date": 1717586782,
      "last_modified_date": 1717586782,
      "z_index": 82,
      "item_mask_id": "7"
    },
    {
      "part_of_design_id": "part_of_design_id 8",
      "item_mask_name": "item_mask_name 8",
      "type_of_item": "type_of_item 8",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 97,
      "scale_y": 27,
      "image_url": "image_url 8",
      "print_type": "print_type 8",
      "create_date": 1717586722,
      "last_modified_date": 1717586722,
      "z_index": 42,
      "item_mask_id": "8"
    },
    {
      "part_of_design_id": "part_of_design_id 9",
      "item_mask_name": "item_mask_name 9",
      "type_of_item": "type_of_item 9",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 88,
      "scale_y": 23,
      "image_url": "image_url 9",
      "print_type": "print_type 9",
      "create_date": 1717586662,
      "last_modified_date": 1717586662,
      "z_index": 82,
      "item_mask_id": "9"
    },
    {
      "part_of_design_id": "part_of_design_id 10",
      "item_mask_name": "item_mask_name 10",
      "type_of_item": "type_of_item 10",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 45,
      "scale_y": 75,
      "image_url": "image_url 10",
      "print_type": "print_type 10",
      "create_date": 1717586602,
      "last_modified_date": 1717586602,
      "z_index": 18,
      "item_mask_id": "10"
    },
    {
      "part_of_design_id": "part_of_design_id 11",
      "item_mask_name": "item_mask_name 11",
      "type_of_item": "type_of_item 11",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 84,
      "scale_y": 6,
      "image_url": "image_url 11",
      "print_type": "print_type 11",
      "create_date": 1717586542,
      "last_modified_date": 1717586542,
      "z_index": 10,
      "item_mask_id": "11"
    },
    {
      "part_of_design_id": "part_of_design_id 12",
      "item_mask_name": "item_mask_name 12",
      "type_of_item": "type_of_item 12",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 78,
      "scale_y": 72,
      "image_url": "image_url 12",
      "print_type": "print_type 12",
      "create_date": 1717586482,
      "last_modified_date": 1717586482,
      "z_index": 18,
      "item_mask_id": "12"
    },
    {
      "part_of_design_id": "part_of_design_id 13",
      "item_mask_name": "item_mask_name 13",
      "type_of_item": "type_of_item 13",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 8,
      "scale_y": 26,
      "image_url": "image_url 13",
      "print_type": "print_type 13",
      "create_date": 1717586422,
      "last_modified_date": 1717586422,
      "z_index": 64,
      "item_mask_id": "13"
    },
    {
      "part_of_design_id": "part_of_design_id 14",
      "item_mask_name": "item_mask_name 14",
      "type_of_item": "type_of_item 14",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 21,
      "scale_y": 23,
      "image_url": "image_url 14",
      "print_type": "print_type 14",
      "create_date": 1717586362,
      "last_modified_date": 1717586362,
      "z_index": 22,
      "item_mask_id": "14"
    },
    {
      "part_of_design_id": "part_of_design_id 15",
      "item_mask_name": "item_mask_name 15",
      "type_of_item": "type_of_item 15",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 86,
      "scale_y": 69,
      "image_url": "image_url 15",
      "print_type": "print_type 15",
      "create_date": 1717586302,
      "last_modified_date": 1717586302,
      "z_index": 76,
      "item_mask_id": "15"
    },
    {
      "part_of_design_id": "part_of_design_id 16",
      "item_mask_name": "item_mask_name 16",
      "type_of_item": "type_of_item 16",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 51,
      "scale_y": 70,
      "image_url": "image_url 16",
      "print_type": "print_type 16",
      "create_date": 1717586242,
      "last_modified_date": 1717586242,
      "z_index": 55,
      "item_mask_id": "16"
    },
    {
      "part_of_design_id": "part_of_design_id 17",
      "item_mask_name": "item_mask_name 17",
      "type_of_item": "type_of_item 17",
      "isSystemItem": false,
      "isPremium": false,
      "position": {
        "x": 0,
        "y": 0
      },
      "scale_x": 41,
      "scale_y": 72,
      "image_url": "image_url 17",
      "print_type": "print_type 17",
      "create_date": 1717586182,
      "last_modified_date": 1717586182,
      "z_index": 40,
      "item_mask_id": "17"
    }
  ]