import React, { useEffect, useMemo, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../../../store';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, PartOfCloth, SLEEVE_CLOTH_PART } from '../../../../models/ClothModel';
import { Resizable } from 're-resizable';
type props = {
    partOfCloth?: PartOfCloth,
    selectedItem?: string
}

const ImageDraggableComponent: React.FC<props> = ({ partOfCloth, selectedItem }) => {
    // ---------------UseState Variable---------------//
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [imgBase64, setImgBase64] = useState<string | undefined>();
    const [parentBounds, setParentBounds] = useState<{ left: number; top: number; right: number; bottom: number } | null>(null);
    const [width, setWidth] = useState<number>(200); // Initial width
    const [height, setHeight] = useState<number>(200); // Initial height
    const [resizing, setResizing] = useState<boolean>(false);
    const [size, setSize] = useState({ width: 200, height: 200 });

    // ---------------Usable Variable---------------//
    const snap = useSnapshot(state);
    // const parentRef = useRef<HTMLDivElement>(null);
    // const draggableRef = useRef<any>(null);

    // ---------------UseEffect---------------//

    useEffect(() => {
        if (selectedItem === LOGO_PART) {
            setImgBase64(snap.imageLogoUrl);

        }

        if (selectedItem === FRONT_CLOTH_PART) {
            setImgBase64(snap.imageFrontClothUrl);

        }

        if (selectedItem === BACK_CLOTH_PART) {
            setImgBase64(snap.imageBackClothUrl);

        }

        if (selectedItem === SLEEVE_CLOTH_PART) {
            setImgBase64(snap.imagesleeveClothUrl);

        }
    }, [selectedItem, snap]);

    useEffect(() => {
        if (selectedItem === LOGO_PART && !resizing) {
            setPosition({ x: snap.logoDecalPositionX, y: snap.logoDecalPositionY })

        }

        if (selectedItem === FRONT_CLOTH_PART) {
            setPosition({ x: snap.frontDecalPositionX, y: snap.frontDecalPositionY })

        }

        if (selectedItem === BACK_CLOTH_PART) {
            setPosition({ x: snap.backDecalPositionX, y: snap.backDecalPositionY })


        }

        if (selectedItem === SLEEVE_CLOTH_PART) {
            setPosition({ x: snap.sleeveDecalPositionX, y: snap.sleeveDecalPositionY })


        }

    }, [partOfCloth])

    // useEffect(() => {
    //     // Get the dimensions of the boundary container
    //     const boundaryContainer = document.querySelector(`.${styles.imageDraggable__boundary}`);
    //     if (boundaryContainer) {
    //         const boundaryRect = boundaryContainer.getBoundingClientRect();

    //         // Calculate initial position to center the image
    //         const initialX = (boundaryRect.width - 100) / 2; // Assuming image width is 100px
    //         const initialY = (boundaryRect.height - 100) / 2; // Assuming image height is 100px

    //         setPosition({ x: initialX, y: initialY });
    //         console.log('x: ', initialX, '-y: ', initialY);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (parentRef.current) {
    //         const { left, top, right, bottom } = parentRef.current.getBoundingClientRect();
    //         const position = parentRef.current.getBoundingClientRect();

    //         setParentBounds({ left, top, right, bottom });
    //         console.log(position);
    //     }
    // }, []);

    useEffect(() => {
        setResizing(resizing)
    }, [resizing])

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

    const _handleDragStart = (e: DraggableEvent | any, ui: DraggableData,) => {
        e.preventDefault();
    };

    const _handleOnDrag = (e: DraggableEvent | any, ui: DraggableData) => {
        e.preventDefault();
        e.target.style.cursor = 'grabbing';

        if (!resizing) {
            const { x, y } = ui;
            setPosition({ x, y });
            console.log({ x, y });
            if (selectedItem === LOGO_PART) {
                // state.logoDecalPositionX = ui.x;
                // state.logoDecalPositionY = ui.y;
                setPosition({ x: 0, y: 0 });
            }

            if (selectedItem === FRONT_CLOTH_PART) {
                state.frontDecalPositionX = ui.x;
                state.frontDecalPositionY = ui.y;
            }

            if (selectedItem === BACK_CLOTH_PART) {
                state.backDecalPositionX = ui.x;
                state.backDecalPositionY = ui.y;
            }

            if (selectedItem === SLEEVE_CLOTH_PART) {
                state.sleeveDecalPositionX = ui.x;
                state.sleeveDecalPositionY = ui.y;
            }
        }
    };

    const _handleDragStop = (e: DraggableEvent | any, ui: DraggableData) => {
        e.target.style.cursor = 'grab';
        if (!resizing) {
            const { x, y } = ui;
            setPosition({ x, y });
            console.log('Drag stopped at:', x, y);
        }

    };

    const imgBase64Memoized = useMemo(() => (
        imgBase64 && <img src={imgBase64} className={`${styles.item__img__resizeable}`} style={{ pointerEvents: 'auto' }} alt="Draggable Image" />
    ), [imgBase64]);



    const __handleResizeStart = () => {
        // console.log('__handleResizeStart');
        // const element = document.querySelector('.imageDraggable__resizeable') as HTMLElement;
        // if (element) {
        //     element.style.pointerEvents = 'none'; // or 'auto' or any other valid value
        // }
        setResizing(true);
        setResizing(true);
    };

    const __handleOnResize = (e: any) => {
        console.log('__handleOnResize');

        // const element = document.querySelector('.imageDraggable__resizeable') as HTMLElement;
        // if (element) {
        //     element.style.pointerEvents = 'none'; // or 'auto' or any other valid value
        // }
        setResizing(true);
    };

    const __handleResizeEnd = () => {
        console.log('__handleResizeEnd');

        // const element = document.querySelector('.imageDraggable__resizeable') as HTMLElement;
        // if (element) {
        //     element.style.pointerEvents = 'auto'; // or 'auto' or any other valid value
        //     console.log(element);
        // }
        setResizing(true);
        setResizing(false);
    };


    return (
        <>

            {partOfCloth ? (
                <div className={styles.imageDraggable__boundary} style={{ backgroundImage: partOfCloth?.imgUrl }}>
                    <div className={styles.imageDraggable__img}>
                        <img src={partOfCloth.imgUrl} className={styles.imageDraggable__img} ></img>
                        {imgBase64 && (

                            <Draggable
                                // bounds={{ top: -100, left: -100, right: 100, bottom: 100 }}
                                // ref={draggableRef} // Set draggableRef as the ref
                                // bounds='parent'
                                position={position}
                                onDrag={_handleOnDrag}
                                onStop={_handleDragStop}
                                onStart={_handleDragStart}
                                disabled={resizing ? true : false}
                                defaultClassNameDragged={`${styles.imageDraggable__resizeable} imageDraggable__resizeable`}

                            >
                                <Resizable
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "solid 1px #ddd",
                                        background: "#f0f0f0"
                                    }}
                                    onResizeStart={__handleResizeStart}
                                    onResize={__handleOnResize}
                                    onResizeStop={__handleResizeEnd}
                                    defaultSize={{ width: 230, height: 230 }}
                                    handleWrapperStyle={{ pointerEvents: 'auto' }}
                                    className={`${styles.resizeable__element}`}
                                    grid={[25,25]}
                                >
                                    <div className={`${styles.resizeable__element__resizeIcon__icon1}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon2}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon3}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon4}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon5}`} ></div>
                                    <div className={`${styles.resizeable__element__resizeIcon__icon6}`} ></div>

                                    {imgBase64Memoized}
                                </Resizable>
                            </Draggable>
                        )}

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
