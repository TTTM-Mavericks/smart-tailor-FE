import { frontOfCloth } from "../assets";
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, SLEEVE_CLOTH_PART } from "./ClothModel";

export interface ItemMaskInterface {
    item_mask_id: string; // UUID
    part_of_design_id?: string; // UUID
    item_mask_name?: string; // Enum?: String
    type_of_item?: string; // String
    position?: number; // Float
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


export const sampleDesignData: DesignInterface = {
    "design_id": "123e4567-e89b-12d3-a456-426614174000",
    "type_of_design": "Shirt",
    "user_id": "223e4567-e89b-12d3-a456-426614174001",
    "expert_tailoring_name": "John Doe",
    "title_design": "Modern T-Shirt",
    "public_status": true,
    "create_date": "2023-05-29T12:34:56Z",
    "last_modified_date": "2023-06-01T08:21:34Z",
    "part_of_item": [
        {
            "part_of_design_id": "323e4567-e89b-12d3-a456-426614174002",
            "design_id": "123e4567-e89b-12d3-a456-426614174000",
            "part_name": "Front",
            "create_date": "2023-05-29T12:34:56Z",
            "last_modified_date": "2023-06-01T08:21:34Z",
            "img_url": "https://example.com/images/front_part.png",
            "item_mask": [
                {
                    "item_mask_id": "423e4567-e89b-12d3-a456-426614174003",
                    "part_of_design_id": "323e4567-e89b-12d3-a456-426614174002",
                    "item_mask_name": "Logo",
                    "type_of_item": "Image",
                    "position": 50.0,
                    "scale_x": 1.0,
                    "scale_y": 1.0,
                    "create_date": "2023-05-29T12:34:56Z",
                    "last_modified_date": "2023-06-01T08:21:34Z",
                    "image_url": "https://example.com/images/logo.png"
                }
            ]
        },
        {
            "part_of_design_id": "523e4567-e89b-12d3-a456-426614174004",
            "design_id": "123e4567-e89b-12d3-a456-426614174000",
            "part_name": "Back",
            "create_date": "2023-05-29T12:34:56Z",
            "last_modified_date": "2023-06-01T08:21:34Z",
            "img_url": "https://example.com/images/back_part.png",
            "item_mask": []
        }
    ]
}

export const PartOfShirtDesignData =  [
    {
      part_of_design_id: '1' ,
      design_id: '1',
      part_name: LOGO_PART, 
      create_date: '',
      last_modified_date: '',
      img_url: frontOfCloth,
      item_mask: [],
  
    },
    {
      part_of_design_id: '2' ,
      design_id: '1',
      part_name: FRONT_CLOTH_PART, 
      create_date: '',
      last_modified_date: '',
      img_url: frontOfCloth,
      item_mask: [],
    },
    {
      part_of_design_id: '3' ,
      design_id: '1',
      part_name: BACK_CLOTH_PART, 
      create_date: '',
      last_modified_date: '',
      img_url: frontOfCloth,
      item_mask: [],
    },
    {
      part_of_design_id: '4' ,
      design_id: '1',
      part_name: SLEEVE_CLOTH_PART, 
      create_date: '',
      last_modified_date: '',
      img_url: frontOfCloth,
      item_mask: [],
    },
  
  ]