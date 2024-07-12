import React, { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import style from './ItemEditorToolsStyle.module.scss'
import { AiOutlineRotateRight } from "react-icons/ai";
import { Move, Minimize, ArrowRight, ArrowDown, DivideSquare, DivideCircle, Menu, RefreshCw, Copy, ZoomIn, ZoomOut } from 'react-feather';

interface ItemEditorToolsComponentProps {
    onValueChange: (value: number) => void;
    itemIdSelected?: any;
    targetRef?: React.RefObject<HTMLDivElement>;
}

interface IconButtonProps {
    icon: JSX.Element;
    alt: string;
}




const ItemEditorToolsComponent: React.FC<ItemEditorToolsComponentProps> = ({ onValueChange, itemIdSelected, targetRef }) => {
    const [value, setValue] = useState<number>(0);
    const [oldItemId, setOldItemId] = useState<any>();

    const divRef = useRef<HTMLDivElement>(null);
    


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


    const __handleFullscreen = () => {
        const elem = targetRef?.current;

        if (elem) {
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if ((elem as any).mozRequestFullScreen) {
            // Firefox
            (elem as any).mozRequestFullScreen();
          } else if ((elem as any).webkitRequestFullscreen) {
            // Chrome, Safari and Opera
            (elem as any).webkitRequestFullscreen();
          } else if ((elem as any).msRequestFullscreen) {
            // IE/Edge
            (elem as any).msRequestFullscreen();
          }
        }
    };

    const icons: IconButtonProps[] = [
        { icon: <Move size={17} />, alt: 'Move' },
        { icon: <Minimize size={17} onClick={__handleFullscreen} />, alt: 'Minimize' },
        { icon: <ArrowRight size={17} />, alt: 'ArrowRight' },
        { icon: <ArrowDown size={17} />, alt: 'ArrowDown' },
        { icon: <DivideSquare size={17} />, alt: 'DivideSquare' },
        { icon: <Copy size={17} />, alt: 'Copy' },
        { icon: <ZoomIn size={17} />, alt: 'ZoomIn' },
        { icon: <ZoomOut size={17}/>, alt: 'ZoomOut' },
    ];
  


    return (
        <div>

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
            <div className="grid grid-cols-4 gap-4 mx-4 my-2">
                {icons.map((icon, index) => (
                    <button key={index} className="bg-white p-2 rounded shadow flex justify-center items-center">
                        {icon.icon}
                    </button>
                ))} 
            </div>

        </div>
    );
};

export default ItemEditorToolsComponent;
