import React, { useEffect, useMemo, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../../../store';
import { Resizable } from 're-resizable';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../../models/DesignModel';
import { Menu, MenuItem } from '@mui/material';
import { IoTrashOutline } from "react-icons/io5";

type props = {
    partOfCloth?: PartOfDesignInterface,
    partOfClothData?: PartOfDesignInterface[],
    itemPositions: any;
    setItemPositions: (positions: { [key: string]: any }) => void;
    itemZIndices: { [key: string]: number };
    setItemZIndices: (zIndices: { [key: string]: any }) => void;
    highestZIndex: number;
    setHighestZIndex: (zIndex: any) => void;
    onDeleteItem: (item: any) => void;
    setNewItemData: (items: PartOfDesignInterface[] | undefined) => void;
    onUpdatePart: (updatePart: PartOfDesignInterface[]) => void;
    stamps?: ItemMaskInterface[] | undefined;
}

const ImageDraggableComponent: React.FC<props> = ({
    partOfCloth,
    partOfClothData,
    itemPositions,
    setItemPositions,
    itemZIndices,
    setItemZIndices,
    highestZIndex,
    setHighestZIndex,
    onDeleteItem,
    setNewItemData,
    onUpdatePart,
    stamps
}) => {

    // TODO MUTIL LANGUAGE

    // ---------------UseState Variable---------------//
    const [resizing, setResizing] = useState<boolean>(false);
    const [size, setSize] = useState({ width: 200, height: 200 });
    const [selectedItemDrag, setSelectedItemDrag] = useState<ItemMaskInterface>();
    const [data, setData] = useState<ItemMaskInterface[] | undefined>();
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [selectedItemForContext, setSelectedItemForContext] = useState<ItemMaskInterface | null>(null);
    const [oldPartOfClothData, setOldPartOfClothData] = useState<PartOfDesignInterface[]>();
    const [positonItemDrag, setPositionItemDrag] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    // ---------------Usable Variable---------------//
    const snap = useSnapshot(state);


    // ---------------UseEffect---------------//

    /**
     * Set value of data when  partOfCloth and partOfClothData change
     */
    useEffect(() => {
        if (JSON.stringify(partOfClothData) !== JSON.stringify(oldPartOfClothData)) {
            console.log('partOfClothData: ', partOfClothData);
            const result: PartOfDesignInterface[] | undefined = partOfClothData?.filter((item: PartOfDesignInterface) => item.part_name === partOfCloth?.part_name);
            if (result && result.length > 0) {
                const itemMask = result.find((item: PartOfDesignInterface) => item.part_of_design_id === partOfCloth?.part_of_design_id);
                if (itemMask) {
                    console.log('itemMask: ', itemMask);
                    setData(itemMask.item_mask);
                    setOldPartOfClothData(partOfClothData);
                }
            }
        }
    }, [partOfCloth, partOfClothData]);

    /**
     * Set PartOfDesignData when part_name === partname of partOfClothData
     */
    useEffect(() => {
        const result = partOfClothData?.filter((item: PartOfDesignInterface) => item.part_name === partOfCloth?.part_name);
        if (result) {
            partOfClothData?.map(part =>
                part.part_of_design_id === partOfCloth?.part_of_design_id
                    ? { ...part, item_mask: !data ? [] : data } : part

            );
        }
    }, [ partOfCloth]);

    /**
     * State change of itemPositions, itemZIndices, size.width, size.height, selectedItemDrag 
     * to trigger __handleSetNewPartOfDesignData function
     */
    useEffect(() => {
        __handleSetNewPartOfDesignData();
    }, [itemPositions, itemZIndices, size.width, size.height, selectedItemDrag]);



    /**
     * Set size of resizable
     */
    useEffect(() => {
        setResizing(resizing)
    }, [resizing])

    /**
     * Set size of resizable
     */
    useEffect(() => {
        const element = document.querySelector('.imageDraggable__resizeable');
        if (element instanceof HTMLElement) {
            const rect = element.getBoundingClientRect();
            setSize({
                width: rect.width,
                height: rect.height,
            });
            console.log('w: ', rect.width, '- h: ', rect.height);
        }
    }, [resizing]);


    // ---------------FunctionHandler---------------//

    /**
     * Save PartOfClothData while edit and response to customDesign
     */
    const __handleSetNewPartOfDesignData = () => {
        const result: ItemMaskInterface[] | undefined = data?.filter((item: ItemMaskInterface) => item.item_mask_id === selectedItemDrag?.item_mask_id);
        if (result) {
            const updateItemData: ItemMaskInterface[] | undefined = data?.map(part =>
                part.item_mask_id === selectedItemDrag?.item_mask_id
                    ? {
                        ...part,
                        // position: positonItemDrag,
                        z_index: itemZIndices,
                        scale_x: size.width,
                        scale_y: size.height
                    }
                    : part
            );
            const updatePart = partOfClothData?.map(part =>
                part.part_of_design_id === partOfCloth?.part_of_design_id
                    ? { ...part, item_mask: !updateItemData ? [] : updateItemData } : part
            );

            if (updatePart) {
                onUpdatePart(updatePart)
                state.modelData = updatePart;
            }

            if (JSON.stringify(updateItemData) !== JSON.stringify(data)) {
                console.log('updateItemData: ', updateItemData);
                setData(updateItemData);
            }
        }
    }


    /**
     * Select drag item
     * @param item 
     */
    const __handleSelectedIteamDrag = (item: ItemMaskInterface) => {
        setSelectedItemDrag(item);
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
            setSelectedItemDrag(item);

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
        if (target) {
            target.style.cursor = 'grab';
            if (!resizing) {
                const { x, y } = ui;
                setData((prevData) => {
                    if (!prevData) return prevData;
                    return prevData.map((dataItem: ItemMaskInterface) => {
                        if (dataItem.item_mask_id === item.item_mask_id) {
                            return {
                                ...dataItem,
                                position: { x: x, y: y },
                                position_x: x,
                                position_y: y
                            };
                        }
                        return dataItem;
                    });
                });

                setSelectedItemDrag(item);

            }
        }
    };

    /**
     * Handle logic when onResizeStart trigger
     */
    const __handleResizeStart = () => {
        setResizing(true);
        setResizing(true);
    };

    /**
     * Handle logic when onResize trigger
     */
    const __handleOnResize = (e: any) => {
        console.log('__handleOnResize');
        setResizing(true);
    };

    /**
     * Handle logic when onResizeEnd trigger
     */
    const __handleResizeEnd = () => {
        console.log('__handleResizeEnd');
        setResizing(true);
        setResizing(false);
        __handleSetNewPartOfDesignData();
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
    };

    /**
     * Handle make item move to above another
     */
    const __handleMoveToAbove = () => {
        if (selectedItemForContext) {
            const currentZIndex = itemZIndices[selectedItemForContext.item_mask_id];
            const newZIndex = currentZIndex + 1;

            setItemZIndices((prevZIndices: any) => {
                const updatedZIndices = { ...prevZIndices };
                Object.keys(updatedZIndices).forEach(key => {
                    if (updatedZIndices[key] === newZIndex) {
                        updatedZIndices[key] = currentZIndex;
                    }
                });
                updatedZIndices[selectedItemForContext.item_mask_id] = newZIndex;
                return updatedZIndices;
            });

            __handleClose();
        }
    };

    /**
     * Handle make item move to below another
     */
    const __handleMoveToBelow = () => {
        if (selectedItemForContext) {
            const currentZIndex = itemZIndices[selectedItemForContext.item_mask_id];
            const newZIndex = currentZIndex - 1;

            setItemZIndices((prevZIndices: any) => {
                const updatedZIndices = { ...prevZIndices };
                Object.keys(updatedZIndices).forEach(key => {
                    if (updatedZIndices[key] === newZIndex) {
                        updatedZIndices[key] = currentZIndex;
                    }
                });
                updatedZIndices[selectedItemForContext.item_mask_id] = newZIndex;
                return updatedZIndices;
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
                    key={item.item_mask_id}
                    position={item.position ? { x: item.position.x, y: item.position.y } : { x: 0, y: 0 }}
                    onDrag={(e, ui) => __handleOnDrag(e, ui, item)}
                    onStop={(e, ui) => __handleDragStop(e, ui, item)}
                    onStart={(e, ui) => __handleDragStart(e, ui, item)}
                    disabled={resizing ? true : false}
                    defaultClassNameDragged={`${styles.imageDraggable__resizeable} imageDraggable__resizeable`}

                >
                    <div style={{ position: 'absolute', zIndex: itemZIndices[item.item_mask_id] ?? 1 }} onContextMenu={(e: any) => __handleContextMenu(e, item)}>
                        <Resizable
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // backgroundColor: 'white',
                                border: 'none',
                                zIndex: itemZIndices[item.item_mask_id] ?? 1,
                            }}
                            onResizeStart={__handleResizeStart}
                            onResize={__handleOnResize}
                            onResizeStop={__handleResizeEnd}
                            defaultSize={{ width: 230, height: 230 }}
                            handleWrapperStyle={{ pointerEvents: 'auto' }}
                            className={`${styles.resizeable__element}`}
                        >
                            {selectedItemDrag === item && (
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
                                        onClick={() => onDeleteItem(item.item_mask_id)}
                                    />
                                </>
                            )}
                            <img src={item.image_url} className={`${styles.item__img__resizeable}`} style={{ border: selectedItemDrag === item ? '1px solid black' : 'none', pointerEvents: 'auto' }} onClick={() => __handleSelectedIteamDrag(item)} alt="Draggable Image" />
                        </Resizable>
                    </div>
                </Draggable>
            )), [data, selectedItemDrag, itemPositions, itemZIndices, resizing])


    return (
        <>

            {partOfCloth ? (
                <div className={styles.imageDraggable__boundary} style={{ backgroundImage: partOfCloth?.img_url }}>
                    <div className={styles.imageDraggable__img}>
                        <img src={partOfCloth.img_url} className={styles.imageDraggable__img} ></img>
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
