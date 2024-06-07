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