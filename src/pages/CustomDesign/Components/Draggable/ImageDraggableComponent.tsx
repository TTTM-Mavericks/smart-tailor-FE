import React, { Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../../../store';
import { Resizable, ResizableProps, ResizeCallback } from 're-resizable';
import { ItemMaskInterface, PartOfDesignInterface } from '../../../../models/DesignModel';
import { Menu, MenuItem } from '@mui/material';
import { IoTrashOutline } from "react-icons/io5";
import zIndex from '@mui/material/styles/zIndex';

type props = {
    partOfCloth?: PartOfDesignInterface,
    partOfClothData?: PartOfDesignInterface[],
    itemPositions: any;
    itemZIndices: { [key: string]: number };
    onDeleteItem: (item: any) => void;
    onUpdatePart: (updatePart: PartOfDesignInterface[]) => void;
    stamps?: ItemMaskInterface[] | undefined;
    rotate?: any;
    onSetIsOtherItemSelected?: (itemId: any) => void;
    onUndo?: () => void;
    onRedo?: () => void;
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
},  ref: Ref<any>) => {

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
    const [history, setHistory] = useState<ItemMaskInterface[][]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);

    // ---------------Usable Variable---------------//
    const snap = useSnapshot(state);


    // ---------------UseEffect---------------//

    /**
     * Set value of data when  partOfCloth and partOfClothData change
     */
    useEffect(() => {
        if (JSON.stringify(partOfClothData) !== JSON.stringify(oldPartOfClothData)) {
            console.log('partOfClothData: ', partOfClothData);
            const result: PartOfDesignInterface[] | undefined = partOfClothData?.filter((item: PartOfDesignInterface) => item.partOfDesignName === partOfCloth?.partOfDesignName);
            if (result && result.length > 0) {
                const itemMasks = result.find((item: PartOfDesignInterface) => item.partOfDesignID === partOfCloth?.partOfDesignID);
                if (itemMasks) {
                    setData(itemMasks.itemMasks);
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
                        rotate: rotate
                    };
                }
                return dataItem;
            });
        });
        console.log(`${rotate}deg`);
    }, [rotate, selectedItemDrag]);

    // useEffect(()=>{
    //     console.log('history: ', history);
    //     state.modelData = data;
    // },[data])



    // ---------------FunctionHandler---------------//

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


    /**
     * Save PartOfClothData while edit and response to customDesign
     */
    const __handleSetNewPartOfDesignData = () => {
        const result: ItemMaskInterface[] | undefined = data?.filter((item: ItemMaskInterface) => item.itemMaskID === selectedItemDrag?.itemMaskID);
        if (result) {
            const updateItemData: ItemMaskInterface[] | undefined = data?.map(part =>
                part.itemMaskID === selectedItemDrag?.itemMaskID
                    ? {
                        ...part,
                        // position: positonItemDrag,
                        // zIndex: itemZIndices,
                        // scaleX: size.width,
                        // scaleY: size.height
                    }
                    : part
            );
            const updatePart = partOfClothData?.map(part =>
                part.partOfDesignID === partOfCloth?.partOfDesignID
                    ? { ...part, itemMasks: !updateItemData ? [] : updateItemData } : part
            );

            if (updatePart) {
                onUpdatePart(updatePart)
                state.modelData = updatePart;
            }
            state.modelData = updatePart;

            if (JSON.stringify(updateItemData) !== JSON.stringify(data)) {
                console.log('updateItemData: ', updateItemData);
                setData(updateItemData);
            }

            // Save the current state to history
            setHistory((prevHistory: any) => {
                const newHistory = [...prevHistory.slice(0, historyIndex + 1), data];
                setHistoryIndex(newHistory.length - 1);
                return newHistory;
            });
        }
    }


    /**
     * Select drag item
     * @param item 
     */
    const __handleSelectedIteamDrag = (item: ItemMaskInterface) => {
        setSelectedItemDrag(item);
        if (onSetIsOtherItemSelected) {
            onSetIsOtherItemSelected(item.itemMaskID);

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
                        if (dataItem.itemMaskID === item.itemMaskID) {
                            return {
                                ...dataItem,
                                position: { x: x, y: y },
                                positionX: x,
                                positionY: y,
                                rotate: rotate
                            };
                        }
                        console.log('{ x: x, y: y }: ', { x: x, y: y });
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
                            zIndex: selectedItemDrag.zIndex + 10
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
                            zIndex: selectedItemDrag.zIndex - 10
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
                    position={item.position ? { x: item.position.x, y: item.position.y } : { x: 0, y: 0 }}
                    onDrag={(e, ui) => __handleOnDrag(e, ui, item)}
                    onStop={(e, ui) => __handleDragStop(e, ui, item)}
                    onStart={(e, ui) => __handleDragStart(e, ui, item)}
                    disabled={resizing ? true : false}
                    defaultClassNameDragged={`${styles.imageDraggable__resizeable} imageDraggable__resizeable`}

                >
                    <div key={item.itemMaskID} style={{ position: 'absolute', zIndex: item.zIndex }} onContextMenu={(e: any) => __handleContextMenu(e, item)}>
                        <Resizable
                            key={item.itemMaskID}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                zIndex: itemZIndices[item.itemMaskID] ?? 1,
                                rotate: `${item.rotate}deg`

                            }}
                            onResizeStart={__handleResizeStart}
                            onResize={__handleOnResize}
                            onResizeStop={(e, direction, refToElement, delta) => __handleResizeEnd(e, direction, refToElement, delta)}
                            defaultSize={item.typeOfItem !== 'TEXT' ? { width: 230, height: 230 } : { width: 230 }}
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
                            <img src={item.imageUrl} className={`${styles.item__img__resizeable}`} style={{ border: selectedItemDrag?.itemMaskID === item.itemMaskID ? '1px solid black' : 'none', pointerEvents: 'auto' }} onClick={() => __handleSelectedIteamDrag(item)} alt="Draggable Image" />
                        </Resizable>
                    </div>
                </Draggable>
            )), [data, selectedItemDrag, itemPositions, itemZIndices, resizing])


    return (
        <>

            {partOfCloth ? (
                <div className={styles.imageDraggable__boundary} style={{ backgroundImage: partOfCloth?.imageUrl }}>
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
