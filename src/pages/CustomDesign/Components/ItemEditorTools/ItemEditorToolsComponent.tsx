import React, { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';
import style from './ItemEditorToolsStyle.module.scss'
import { AiOutlineRotateRight } from "react-icons/ai";

interface ItemEditorToolsComponentProps {
    onValueChange: (value: number) => void;
    itemIdSelected?: any;
}

const ItemEditorToolsComponent: React.FC<ItemEditorToolsComponentProps> = ({ onValueChange, itemIdSelected }) => {
    const [value, setValue] = useState<number>(0);
    const [oldItemId, setOldItemId] = useState<any>();

    const __handleChange = (event: Event, newValue: number | number[]) => {
        const updatedValue = newValue as number;
        setValue(updatedValue);
        onValueChange(updatedValue);
    };

    const __handleReset = (newValue: number | number[]) => {
        if (itemIdSelected === oldItemId) {
            const updatedValue = newValue as number;
            setValue(updatedValue);
            onValueChange(updatedValue);
        } else {
            setValue(0);
            onValueChange(0);
            setOldItemId(itemIdSelected);
        }
    };


    return (
        <div className={`${style.itemEditor__conainer}`}>
            <button>Rotate</button>
            <Slider
                style={{ width: 100 }}
                size="small"
                value={value}
                onChange={__handleChange}
                aria-label="Small"
                valueLabelDisplay="auto"
                max={360}
            />
            <AiOutlineRotateRight className={`${style.itemEditor__conainer__icon}`} onClick={() => __handleReset(0)} size={30} />
        </div>
    );
};

export default ItemEditorToolsComponent;
