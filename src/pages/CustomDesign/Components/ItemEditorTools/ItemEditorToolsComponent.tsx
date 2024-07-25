import React, { useState, useRef, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { AiOutlineRotateRight } from "react-icons/ai";
import { Move, Minimize, ArrowRight, ArrowDown, DivideSquare, Copy, ZoomIn, ZoomOut } from 'react-feather';
import style from './ItemEditorToolsStyle.module.scss';
import { MdOutlineCropRotate } from "react-icons/md";
import { AiOutlineRadiusUpleft, AiOutlineRadiusUpright } from "react-icons/ai";
import { AiOutlineRadiusBottomleft, AiOutlineRadiusBottomright } from "react-icons/ai";
import { styled } from '@mui/system';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../../models/DesignModel';

interface ItemEditorToolsComponentProps {
    onValueChange: (value: {itemMaskID: any, value: number}) => void;
    itemIdSelected?: any;
    targetRef?: React.RefObject<HTMLDivElement>;
    onGetBorderRadiusValueChange?: (value: BorderRadiusItemMaskInterface) => void;
    selectedItemMask?: ItemMaskInterface;
    partOfDesignData?: PartOfDesignInterface[];
    selectedPartOfDesign?: PartOfDesignInterface;
}

interface IconButtonProps {
    icon: JSX.Element;
    alt: string;
}

interface BorderRadiusItemMaskInterface {
    topLeftRadius?: number;
    topRightRadius?: number;
    bottomLeftRadius?: number;
    bottomRightRadius?: number;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: '0px 4px 6px rgba(136,137,144, 0.8)',
        fontSize: 11,
    },
}));

const ItemEditorToolsComponent: React.FC<ItemEditorToolsComponentProps> = ({
    onValueChange,
    itemIdSelected,
    targetRef,
    onGetBorderRadiusValueChange,
    selectedItemMask,
    partOfDesignData,
    selectedPartOfDesign

}) => {

    const [value, setValue] = useState<{itemMaskID: any, value: number}>();
    const [oldItemId, setOldItemId] = useState<any>();
    const [borderRadiusItemMask, setBorderRadiusItemMask] = useState<BorderRadiusItemMaskInterface>({
        topLeftRadius: 0,
        topRightRadius: 0,
        bottomLeftRadius: 0,
        bottomRightRadius: 0,
    });

    const [oldSelectedItemMask, setOldSelectedItemMask] = useState<ItemMaskInterface>();

    useEffect(() => {
        console.log('ItemEditorToolsComponent - partOfDesignData', partOfDesignData);
        // console.log('ItemEditorToolsComponent - selectedPartOfDesign', selectedItemMask?.itemMaskID);

        const part = partOfDesignData?.find((part) => part.partOfDesignID === selectedPartOfDesign?.partOfDesignID);
        if (part) {
            part?.itemMasks?.map((item) => {
                if (item.itemMaskID === selectedItemMask?.itemMaskID) {
                    // setValue(item.rotate);
                    // setBorderRadiusItemMask({
                    //     topLeftRadius: item?.topLeftRadius,
                    //     topRightRadius: item?.topRightRadius,
                    //     bottomLeftRadius: item?.bottomLeftRadius,
                    //     bottomRightRadius: item?.bottomRightRadius,
                    // })
                }
            })
        }


    }, [selectedItemMask, selectedPartOfDesign, partOfDesignData]);

    // useEffect(() => {
    //     console.log('11111111111111111111111111111111111111111111111111111111111111');
    //     partOfDesignData?.map((part) => {
    //         if (part.partOfDesignID === selectedPartOfDesign?.partOfDesignID) {
    //             part?.itemMasks?.map((item) => {
    //                 if (item.itemMaskID === selectedItemMask?.itemMaskID) {
    //                     setValue(item.rotate);
    //                     setBorderRadiusItemMask({
    //                         bottomLeftRadius: item?.bottomLeftRadius || 0,
    //                         bottomRightRadius: item?.bottomRightRadius || 0,
    //                         topLeftRadius: item?.topLeftRadius || 0,
    //                         topRightRadius: item?.topRightRadius || 0
    //                     })
    //                 }
    //             })
    //         }
    //     })


    // }, [partOfDesignData, selectedPartOfDesign, selectedItemMask])

    useEffect(() => {
        if (onGetBorderRadiusValueChange) {
            onGetBorderRadiusValueChange(borderRadiusItemMask);
        }
    }, [borderRadiusItemMask, onGetBorderRadiusValueChange]);

    const divRef = useRef<HTMLDivElement>(null);

    const __handleChange = (event: Event, newValue: number | number[]) => {
        const updatedValue = newValue as number;
        setValue({itemMaskID: selectedItemMask?.itemMaskID, value: updatedValue});
        onValueChange({itemMaskID: selectedItemMask?.itemMaskID, value: updatedValue});
    };

    const __handleReset = (newValue: number | number[]) => {
        if (itemIdSelected === oldItemId) {
            const updatedValue = newValue as number;
            setValue({itemMaskID: selectedItemMask?.itemMaskID, value: updatedValue});
            onValueChange({itemMaskID: selectedItemMask?.itemMaskID, value: updatedValue});
        } else {
            setValue({itemMaskID: selectedItemMask?.itemMaskID, value: 0});
            onValueChange({itemMaskID: selectedItemMask?.itemMaskID, value: 0});
            setOldItemId(itemIdSelected);
        }
    };

    const __handleFullscreen = () => {
        const elem = targetRef?.current;
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if ((elem as any).mozRequestFullScreen) {
                (elem as any).mozRequestFullScreen();
            } else if ((elem as any).webkitRequestFullscreen) {
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) {
                (elem as any).msRequestFullscreen();
            }
        }
    };

    const __handleBorderRadiusChange = (key: keyof BorderRadiusItemMaskInterface) => (event: Event, newValue: number | number[]) => {
        const value = newValue as number;
        setBorderRadiusItemMask(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const icons: IconButtonProps[] = [
        { icon: <Move size={17} />, alt: 'Move' },
        { icon: <Minimize size={17} onClick={__handleFullscreen} />, alt: 'Minimize' },
        { icon: <ArrowRight size={17} />, alt: 'ArrowRight' },
        { icon: <ArrowDown size={17} />, alt: 'ArrowDown' },
        { icon: <DivideSquare size={17} />, alt: 'DivideSquare' },
        { icon: <Copy size={17} />, alt: 'Copy' },
        { icon: <ZoomIn size={17} />, alt: 'ZoomIn' },
        { icon: <ZoomOut size={17} />, alt: 'ZoomOut' },
    ];

    const SliderTooltip = ({ value, onChange, max }: { value: number, onChange: (event: Event, newValue: number | number[]) => void, max: number }) => (
        <Slider
            style={{ width: 80 }}
            size="small"
            value={value}
            onChange={onChange}
            aria-label="Small"
            valueLabelDisplay="auto"
            max={max}
        />
    );

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mx-4 my-2">
                <LightTooltip
                    title={<SliderTooltip value={value?.value || 0} onChange={__handleChange} max={360} />}
                    placement="top"
                    arrow
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                        },
                    }}
                >
                    <button className="bg-white p-2 rounded shadow flex justify-center items-center">
                        <MdOutlineCropRotate size={17} />
                    </button>
                </LightTooltip>

                <LightTooltip
                    title={<SliderTooltip value={borderRadiusItemMask?.topLeftRadius || 0} onChange={__handleBorderRadiusChange('topLeftRadius')} max={360} />}
                    placement="top"
                    arrow
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                        },
                    }}
                >
                    <button className="bg-white p-2 rounded shadow flex justify-center items-center">
                        <AiOutlineRadiusUpleft size={17} />
                    </button>
                </LightTooltip>

                <LightTooltip
                    title={<SliderTooltip value={borderRadiusItemMask?.topRightRadius || 0} onChange={__handleBorderRadiusChange('topRightRadius')} max={360} />}
                    placement="top"
                    arrow
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                        },
                    }}
                >
                    <button className="bg-white p-2 rounded shadow flex justify-center items-center">
                        <AiOutlineRadiusUpright size={17} />
                    </button>
                </LightTooltip>

                <LightTooltip
                    title={<SliderTooltip value={borderRadiusItemMask?.bottomLeftRadius || 0} onChange={__handleBorderRadiusChange('bottomLeftRadius')} max={360} />}
                    placement="top"
                    arrow
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                        },
                    }}
                >
                    <button className="bg-white p-2 rounded shadow flex justify-center items-center">
                        <AiOutlineRadiusBottomleft size={17} />
                    </button>
                </LightTooltip>

                <LightTooltip
                    title={<SliderTooltip value={borderRadiusItemMask?.bottomRightRadius || 0} onChange={__handleBorderRadiusChange('bottomRightRadius')} max={360} />}
                    placement="top"
                    arrow
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'white',
                        },
                    }}
                >
                    <button className="bg-white p-2 rounded shadow flex justify-center items-center">
                        <AiOutlineRadiusBottomright size={17} />
                    </button>
                </LightTooltip>
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
