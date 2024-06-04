export interface MaskItemInterface {
    item_mask_id: string; // UUID
    part_of_design_id?: string; // UUID
    item_mask_name?: string; // Enum?: String
    type_of_item?: string; // String
    position_x?: number; // Float
    position_y?: number; // Float
    scale_x?: number; // Float
    scale_y?: number; // Float
    create_date?: string; // LocalDateTime
    last_modified_date?: string; // LocalDateTime
    image_url: string;
    isSystemItem?: boolean;
    isPremium?: boolean;


}

export interface PartOfDesignInterface {
    part_of_design_id?: string; // UUID
    design_id?: string; // UUID
    part_name?: string; // Enum?: String
    create_date?: string; // LocalDateTime
    last_modified_date?: string; // LocalDateTime
    img_url: string;
    mask_item?: MaskItemInterface[];
}

export interface DesignInterface {
    design_id?: string; // UUID
    user_id?: string; // UUID
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
            "mask_item": [
                {
                    "item_mask_id": "423e4567-e89b-12d3-a456-426614174003",
                    "part_of_design_id": "323e4567-e89b-12d3-a456-426614174002",
                    "item_mask_name": "Logo",
                    "type_of_item": "Image",
                    "position_x": 50.0,
                    "position_y": 75.0,
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
            "mask_item": []
        }
    ]
}
