import React, { Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../../../store';
import { Resizable, ResizableProps, ResizeCallback } from 're-resizable';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../../models/DesignModel';
import { Menu, MenuItem } from '@mui/material';
import { IoTrashOutline } from "react-icons/io5";
import zIndex from '@mui/material/styles/zIndex';
import { __handleGetElementAsBase64 } from '../../../../utils/CanvasUtils';
import html2canvas from 'html2canvas';


interface BorderRadiusItemMaskInterface {
    topLeftRadius?: number;
    topRightRadius?: number;
    bottomLeftRadius?: number;
    bottomRightRadius?: number;
}

interface ItemSizeInterface {
    width?: number,
    height?: number
}

type props = {
    partOfCloth?: PartOfDesignInterface,
    partOfClothData?: PartOfDesignInterface[],
    itemPositions: any;
    itemZIndices: { [key: string]: number };
    onDeleteItem: (item: any) => void;
    onUpdatePart: (updatePart: PartOfDesignInterface[]) => void;
    stamps?: ItemMaskInterface[] | undefined;
    rotate?: { itemMaskID: any, value: number };
    onSetIsOtherItemSelected?: (itemId: any) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    isOutSideClick?: boolean;
    onGetStateOuside?: (state: boolean) => void;
    onTriggerConvertSuccessImg?: () => void;
    borderRadiusItemMask?: BorderRadiusItemMaskInterface,
    onGetSelectedItemDrag: (value: ItemMaskInterface) => void;
    itemSize?: ItemSizeInterface;
}

const ImageDraggableComponent: React.FC<props> = ({
    partOfCloth,
    partOfClothData,
    itemPositions,
    itemZIndices,
    onDeleteItem,
    onUpdatePart,
    stamps,
    rotate,
    onSetIsOtherItemSelected,
    onUndo,
    onRedo,
    isOutSideClick,
    onGetStateOuside,
    onTriggerConvertSuccessImg,
    borderRadiusItemMask,
    onGetSelectedItemDrag,
    itemSize
}, ref: Ref<any>) => {

    // TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [resizing, setResizing] = useState<boolean>(false);
    const [size, setSize] = useState<{ width?: number, height?: number }>({ width: 200, height: 200 });
    const [selectedItemDrag, setSelectedItemDrag] = useState<ItemMaskInterface>();
    const [data, setData] = useState<ItemMaskInterface[] | undefined>();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [selectedItemForContext, setSelectedItemForContext] = useState<ItemMaskInterface | null>(null);
    const [oldPartOfClothData, setOldPartOfClothData] = useState<PartOfDesignInterface[]>();
    const [history, setHistory] = useState<ItemMaskInterface[][]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [isClickOutSide, setIsClickOutSide] = useState<boolean>(false);
    const [successImgPartOfDesign, setSuccessImgPartOfDesign] = useState<string>('');

    // ---------------Usable Variable---------------//
    const snap = useSnapshot(state);


    // ---------------UseEffect---------------//

    useEffect(() => {
        setData(data);
    }, [data])


    /**
     * Set value of data when  partOfCloth and partOfClothData change
     */
    useEffect(() => {
        if (JSON.stringify(partOfClothData) !== JSON.stringify(oldPartOfClothData)) {
            console.log('Item drag - partOfClothData: ', partOfClothData);
            const result: PartOfDesignInterface[] | undefined = partOfClothData?.filter((item: PartOfDesignInterface) => item.partOfDesignName === partOfCloth?.partOfDesignName);
            if (result && result.length > 0) {
                const itemMasks = result.find((item: PartOfDesignInterface) => item.partOfDesignID === partOfCloth?.partOfDesignID);
                if (itemMasks && itemMasks.itemMasks) {
                    const setPositionDefault = itemMasks.itemMasks.map((item) => ({
                        ...item,
                        position: { x: item.positionX, y: item.positionY },
                        zIndex: item.indexZ,
                    }));
                    setData(setPositionDefault as ItemMaskInterface[]);
                    setOldPartOfClothData(partOfClothData);
                }

            }
        }
    }, [partOfCloth, partOfClothData]);

    /**
     * Set PartOfDesignData when partOfDesignName === partname of partOfClothData
     */
    useEffect(() => {
        const result = partOfClothData?.filter((item: PartOfDesignInterface) => item.partOfDesignName === partOfCloth?.partOfDesignName);
        if (result) {
            partOfClothData?.map(part =>
                part.partOfDesignID === partOfCloth?.partOfDesignID
                    ? { ...part, itemMasks: !data ? [] : data } : part

            );
        }
    }, [partOfCloth]);

    /**
     * State change of itemPositions, itemZIndices, size.width, size.height, selectedItemDrag 
     * to trigger __handleSetNewPartOfDesignData function
     */
    useEffect(() => {
        __handleSetNewPartOfDesignData();
    }, [itemPositions, itemZIndices, size.width, size.height, selectedItemDrag, size]);


    /**
     * Set size of resizable
     */
    useEffect(() => {
        setResizing(resizing)
    }, [resizing])

    /**
     * Set rotate degree for item
     */
    useEffect(() => {
        if (!selectedItemDrag) return;
        setData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((dataItem: ItemMaskInterface) => {
                if (dataItem.itemMaskID === selectedItemDrag.itemMaskID) {
                    return {
                        ...dataItem,
                        rotate: selectedItemDrag.itemMaskID === rotate?.itemMaskID ? rotate?.value : dataItem.rotate
                    };
                }
                return dataItem;
            });
        });
    }, [rotate]);

    // useEffect(()=>{
    //     console.log('history: ', history);
    //     state.modelData = data;
    // },[data])


    /**
     * Set rotate degree for item
     */
    useEffect(() => {
        if (!selectedItemDrag) return;
        setData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((dataItem: ItemMaskInterface) => {
                if (dataItem.itemMaskID === selectedItemDrag.itemMaskID) {
                    return {
                        ...dataItem,
                        topLeftRadius: borderRadiusItemMask?.topLeftRadius,
                        topRightRadius: borderRadiusItemMask?.topRightRadius,
                        bottomLeftRadius: borderRadiusItemMask?.bottomLeftRadius,
                        bottomRightRadius: borderRadiusItemMask?.bottomRightRadius
                    };
                }
                return dataItem;
            });
        });


    }, [borderRadiusItemMask]);

    /**
     * Set item size
     */
    useEffect(() => {
        if (!selectedItemDrag) return;
        setData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((dataItem: ItemMaskInterface) => {
                if (dataItem.itemMaskID === selectedItemDrag.itemMaskID) {
                    return {
                        ...dataItem,
                        scaleX: itemSize?.width,
                        scaleY: itemSize?.height
                    };
                }
                return dataItem;
            });
        });


    }, [itemSize]);


    // ---------------FunctionHandler---------------//

    const __handleGetDefaultSize = (item: ItemMaskInterface, itemSize?: { width?: number; height?: number }) => {
        // If itemSize is provided, use it; otherwise, fall back to scaleX/scaleY
        return itemSize
            ? { width: itemSize.width ?? item.scaleX, height: itemSize.height ?? item.scaleY }
            : { width: item.scaleX, height: item.scaleY };
    };

    const __handleUndo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setData(prevState);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const __handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setData(nextState);
            setHistoryIndex(historyIndex + 1);

        }
    };

    const [base64Image, setBase64Image] = useState<string>('');
    const elementRef = useRef(null);

    const captureElementAsBase64 = async (element: HTMLElement): Promise<string | null> => {
        try {
            const canvas = await html2canvas(element, {
                backgroundColor: null, // This option removes the background
                scale: window.devicePixelRatio, // Improve image quality
                logging: false // Disable logging if not needed
            });
            const imgBase64 = canvas.toDataURL('image/png');
            return imgBase64;
        } catch (error) {
            console.error('Error capturing element:', error);
            return null;
        }
    };

    /**
     * Save PartOfClothData while edit and response to customDesign
     */
    const __handleSetNewPartOfDesignData = async () => {
        if (!selectedItemDrag || !data) return;

        const element = document.querySelector(`[data-item-mask-id="${selectedItemDrag.itemMaskID}"]`) as HTMLElement;

        const result = data.filter((item: ItemMaskInterface) => item.itemMaskID === selectedItemDrag.itemMaskID);
        if (!result.length) return;

        const url = await __handleGetElementAsBase64('designArea');
        const base64Image = await captureElementAsBase64(element);

        const updatedItemData = data.map(part =>
            part.itemMaskID === selectedItemDrag.itemMaskID
                ? {
                    ...part,
                    imageUrl: base64Image || part.imageUrl, // Fallback to the existing imageUrl if base64Image is null
                }
                : part
        );

        const updatedPart = partOfClothData?.map(part =>
            part.partOfDesignID === partOfCloth?.partOfDesignID
                ? { ...part, itemMasks: updatedItemData, successImageUrl: url }
                : part
        );

        if (updatedPart) {
            onUpdatePart(updatedPart);
        }

        if (JSON.stringify(updatedItemData) !== JSON.stringify(data)) {
            console.log('Updated Item Data:', updatedItemData);
            setData(updatedItemData);
        }

        // Save the current state to history
        setHistory(prevHistory => {
            const newHistory = [...prevHistory.slice(0, historyIndex + 1), updatedItemData];
            setHistoryIndex(newHistory.length - 1);
            return newHistory;
        });
    };


    /**
     * Select drag item
     * @param item 
     */
    // const __handleSelectedIteamDrag = (item: ItemMaskInterface) => {
    //     console.log('__handleSelectedIteamDrag: ', item);
    //     setSelectedItemDrag((prevSelectedItem) => {
    //         if (prevSelectedItem?.itemMaskID === item.itemMaskID) {
    //             if (onSetIsOtherItemSelected) {
    //                 onSetIsOtherItemSelected(undefined);
    //             }
    //             return undefined;
    //         } else {
    //             if (onSetIsOtherItemSelected) {
    //                 onSetIsOtherItemSelected(item.itemMaskID);
    //             }
    //             return item;
    //         }
    //     });
    // };
    const __handleSelectedIteamDrag = async (item: ItemMaskInterface) => {
        const element = document.querySelector(`[data-item-mask-id="${item.itemMaskID}"]`) as HTMLElement;

        if (element) {
            const base64Image = await captureElementAsBase64(element);
            if (base64Image) {
                console.log('Base64 Image:', base64Image);
            }
        }
        console.log('base64Image: ', base64Image);
        setSelectedItemDrag(item);
        if (onSetIsOtherItemSelected) {
            onSetIsOtherItemSelected(item.itemMaskID);
            onGetSelectedItemDrag(item)
        }
    };


    /**
     * Handle logic when onDragStart trigger
     * @param e 
     * @param ui 
     * @param item 
     */
    const __handleDragStart = (e: DraggableEvent, ui: DraggableData, item: ItemMaskInterface) => {
        const target = e.target as HTMLElement;
        if (target) {
            e.preventDefault();
            // setSelectedItemDrag(item);
        }
    };

    /**
     * Handle logic when onDrag trigger
     * @param e
     * @param ui 
     * @param item 
     */
    const __handleOnDrag = (e: DraggableEvent, ui: DraggableData, item: ItemMaskInterface) => {
        const target = e.target as HTMLElement;
        if (target) {
            e.preventDefault();
            target.style.cursor = 'grabbing';

        }
    };

    /**
     * Handle set position when onDragEnd trigger
     * @param e 
     * @param ui 
     * @param item 
     */
    const __handleDragStop = (e: DraggableEvent, ui: DraggableData, item: ItemMaskInterface) => {
        const target = e.target as HTMLElement;
        e.preventDefault();
        if (target) {
            target.style.cursor = 'grab';
            if (!resizing) {
                const { x, y } = ui;
                setData((prevData) => {
                    if (!prevData) return prevData;
                    return prevData.map((dataItem: ItemMaskInterface) => {
                        if (dataItem.itemMaskID === item.itemMaskID) {
                            return {
                                ...dataItem,
                                position: { x: x, y: y },
                                positionX: x,
                                positionY: y,
                                // rotate: rotate,
                                // topLeftRadius: borderRadiusItemMask?.topLeftRadius,
                                // topRightRadius: borderRadiusItemMask?.topRightRadius,
                                // bottomLeftRadius: borderRadiusItemMask?.bottomLeftRadius,
                                // bottomRightRadius: borderRadiusItemMask?.bottomRightRadius

                            };
                        }
                        return dataItem;
                    });
                });

            }
        }
    };

    /**
     * Handle logic when onResizeStart trigger
     */
    const __handleResizeStart = () => {
        setResizing(true);
    };

    /**
     * Handle logic when onResize trigger
     */
    const __handleOnResize = (e: any) => {
        setResizing(true);
    };

    /**
     * Handle logic when onResizeEnd trigger
     */
    const __handleResizeEnd: ResizeCallback = (e, direction, refToElement, delta) => {
        const target = refToElement as HTMLElement;
        e.preventDefault();
        if (target) {
            target.style.cursor = 'grab';
            setResizing(false); // End resizing after the state updates

            setData((prevData) => {
                if (!prevData) return prevData;

                // Get new width and height from the refToElement
                const newWidth = target.style.width ? parseInt(target.style.width, 10) : undefined;
                const newHeight = target.style.height ? parseInt(target.style.height, 10) : undefined;

                return prevData.map((dataItem: ItemMaskInterface) => {
                    if (dataItem.itemMaskID === selectedItemDrag?.itemMaskID) {
                        return {
                            ...dataItem,
                            scaleX: newWidth,
                            scaleY: newHeight,
                        };
                    }
                    setSize({ width: newWidth, height: newHeight })
                    console.log('neww: ', newWidth, '- newH: ', newHeight);
                    return dataItem;
                });
            });

        }
    };

    /**
     * Handle open menu wwhen MouseEvent trigger
     * @param event 
     * @param item 
     */
    const __handleContextMenu = (event: MouseEvent, item: ItemMaskInterface) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                }
                : null,
        );
        setSelectedItemForContext(item);
    };

    /**
     * Handle close menu
     */
    const __handleClose = () => {
        setContextMenu(null);
        setSelectedItemForContext(null);
        setSelectedItemDrag(selectedItemDrag);
    };

    /**
     * Handle make item move to above another
     */
    const __handleMoveToAbove = () => {
        // if (selectedItemForContext) {
        //     const currentZIndex = itemZIndices[selectedItemForContext.itemMaskID];
        //     const newZIndex = currentZIndex + 1;
        //     console.log('newZIndex: ', newZIndex);

        //     setItemZIndices((prevZIndices: any) => {
        //         const updatedZIndices = { ...prevZIndices };
        //         Object.keys(updatedZIndices).forEach(key => {
        //             if (updatedZIndices[key] === newZIndex) {
        //                 updatedZIndices[key] = currentZIndex;
        //             }
        //         });
        //         updatedZIndices[selectedItemForContext.itemMaskID] = newZIndex;
        //         return updatedZIndices;
        //     });
        if (selectedItemDrag) {
            setData((prevData) => {
                if (!prevData) return prevData;
                return prevData.map((dataItem: ItemMaskInterface) => {
                    if (dataItem.itemMaskID === selectedItemDrag.itemMaskID) {
                        return {
                            ...dataItem,
                            zIndex: selectedItemDrag.zIndex + 1,
                            indexZ: selectedItemDrag.zIndex + 1

                        };
                    }
                    return dataItem;
                });
            });
            __handleClose();
        }
    };

    /**
     * Handle make item move to below another
     */
    const __handleMoveToBelow = () => {
        if (selectedItemDrag) {
            setData((prevData) => {
                if (!prevData) return prevData;
                return prevData.map((dataItem: ItemMaskInterface) => {
                    if (dataItem.itemMaskID === selectedItemDrag.itemMaskID) {
                        return {
                            ...dataItem,
                            zIndex: selectedItemDrag.zIndex - 1,
                            indexZ: selectedItemDrag.zIndex - 1

                        };
                    }
                    return dataItem;
                });
            });
            __handleClose();
        }


    };

    /**
     * resizableItems element
     */
    const resizableItems = useMemo(
        () =>
            data && data?.map((item: ItemMaskInterface) => (
                <Draggable
                    key={item.itemMaskID}
                    // position={item.positionX && item.positionY ? { x: item.positionX, y: item.positionY } : { x: 0, y: 0 }}
                    position={item.position ? { x: item.position.x, y: item.position.y } : { x: 0, y: 0 }}
                    onDrag={(e, ui) => __handleOnDrag(e, ui, item)}
                    onStop={(e, ui) => __handleDragStop(e, ui, item)}
                    onStart={(e, ui) => __handleDragStart(e, ui, item)}
                    disabled={resizing ? true : false}
                    defaultClassNameDragged={`${styles.imageDraggable__resizeable} imageDraggable__resizeable`}

                >
                    <div
                        key={item.itemMaskID}
                        style={{ position: 'absolute', zIndex: item.indexZ }}
                        onContextMenu={(e: any) => __handleContextMenu(e, item)}
                    >
                        <Resizable
                            key={item.itemMaskID}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: selectedItemDrag?.itemMaskID === item.itemMaskID ? '1px solid black' : 'none',
                                zIndex: itemZIndices[item.itemMaskID] ?? 1,
                                rotate: `${item.rotate}deg`,
                            }}
                            onResizeStart={__handleResizeStart}
                            onResize={__handleOnResize}
                            onResizeStop={(e, direction, refToElement, delta) => __handleResizeEnd(e, direction, refToElement, delta)}
                            defaultSize={item.typeOfItem !== 'TEXT' ? { width: item.scaleX, height: item.scaleY } : { width: 230 }}
                            // defaultSize={__handleGetDefaultSize(item, itemSize)}
                            handleWrapperStyle={{ pointerEvents: 'auto' }}
                            className={`${styles.resizeable__element}`}

                        >
                            {selectedItemDrag?.itemMaskID === item.itemMaskID && (
                                <>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon1}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon2}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon3}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon4}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon5}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon6}`} ></div>
                                    <IoTrashOutline
                                        mode={'outline'}
                                        size={20}
                                        className={`${styles.resizeable__element__resizeIcon__icon7}`}
                                        onClick={() => onDeleteItem(item.itemMaskID)}
                                    />
                                </>
                            )}
                            <img
                                src={item.imageUrl}
                                className={`${styles.item__img__resizeable}`}
                                style={
                                    {
                                        pointerEvents: 'auto',
                                        borderTopLeftRadius: item.topLeftRadius,
                                        borderTopRightRadius: item.topRightRadius,
                                        borderBottomLeftRadius: item.bottomLeftRadius,
                                        borderBottomRightRadius: item.bottomRightRadius,
                                        // transform: 'scaleX(-1)'
                                    }
                                }
                                onClick={() => __handleSelectedIteamDrag(item)} alt="Draggable Image"
                                data-item-mask-id={item.itemMaskID}

                            />
                        </Resizable>
                    </div>
                </Draggable>
            )), [data, selectedItemDrag, itemPositions, itemZIndices, resizing, rotate, borderRadiusItemMask, itemSize]);

    return (
        <>

            {partOfCloth ? (
                <div id="designArea" className={styles.imageDraggable__boundary} style={{ backgroundImage: partOfCloth?.imageUrl }}>
                    <div className={styles.imageDraggable__img}>
                        <img src={partOfCloth.imageUrl} className={styles.imageDraggable__img} ></img>
                        {resizableItems}
                        <Menu
                            open={contextMenu !== null}
                            onClose={__handleClose}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu !== null
                                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                    : undefined
                            }
                        >
                            <MenuItem onClick={__handleMoveToAbove}>Move to Above</MenuItem>
                            <MenuItem onClick={__handleMoveToBelow}>Move to Below</MenuItem>
                            <MenuItem onClick={__handleUndo}>Undo</MenuItem>
                            <MenuItem onClick={__handleRedo}>Redo</MenuItem>
                        </Menu>
                    </div>



                </div >
            ) : (
                <div className={styles.imageDraggable__boundary}>
                    Choose part of cloth
                </div>
            )}


        </>
    );
}

export default ImageDraggableComponent;
