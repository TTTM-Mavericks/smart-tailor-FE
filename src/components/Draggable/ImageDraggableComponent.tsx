import React, { useEffect, useMemo, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../store';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, PartOfCloth, SLEEVE_CLOTH_PART } from '../../models/ClothModel';
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
    const parentRef = useRef<HTMLDivElement>(null);
    const draggableRef = useRef<any>(null);

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
        if (selectedItem === LOGO_PART) {
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

    useEffect(() => {
        if (parentRef.current) {
            const { left, top, right, bottom } = parentRef.current.getBoundingClientRect();
            const position = parentRef.current.getBoundingClientRect();

            setParentBounds({ left, top, right, bottom });
            console.log(position);
        }
    }, []);

    useEffect(() => {
        setResizing(resizing)
    }, [resizing])

    // ---------------FunctionHandler---------------//

    const _handleDragStart = (e: DraggableEvent | any, ui: DraggableData,) => {
        e.preventDefault()
        e.target.style.cursor = 'grabbing';
    };

    const _handleOnDrag = (e: DraggableEvent, ui: DraggableData) => {
        console.log('dragg');
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

    const _handleDragStop = (e: any, ui: DraggableData) => {
        if (!resizing) {
            const { x, y } = ui;
            setPosition({ x, y });
            console.log('Drag stopped at:', x, y);
            e.target.style.cursor = 'grab';
        }
    };

    const imgBase64Memoized = useMemo(() => (
        imgBase64 && <img src={imgBase64} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} alt="Draggable Image" />
    ), [imgBase64]);



    const _handleResizeStart = () => {
        setResizing(true);
    };

    const _handleOnResize = () => {
        setResizing(true);
    };

    const _handleResizeEnd = () => {
        setResizing(false);
    };


    return (
        <>

            {partOfCloth ? (
                <div className={styles.imageDraggable__boundary} ref={parentRef} style={{ backgroundImage: partOfCloth?.imgUrl }}>
                    <div className={styles.imageDraggable__img}>
                        <img src={partOfCloth.imgUrl} className={styles.imageDraggable__img} ></img>

                        <Resizable
                            defaultSize={{
                                width: 250,
                                height: 300,
                            }}
                            className={styles.imageDraggable__resizeable}
                            onResizeStart={_handleResizeStart}
                            onResize={_handleOnResize}
                            onResizeStop={_handleResizeEnd}
                            maxHeight={500}
                            maxWidth={450}
                            ref={draggableRef}                                
                            

                        >
                            <Draggable
                                bounds={{ top: -100, left: -100, right: 100, bottom: 100 }}
                                ref={draggableRef} // Set draggableRef as the ref
                                // bounds='parent'
                                position={position}
                                onDrag={_handleOnDrag}
                                onStop={_handleDragStop}
                                onStart={_handleDragStart}
                                disabled={resizing ? true : false}
                                defaultClassNameDragged={styles.imageDraggable__resizeable}
                            >

                                <div>
                                    {imgBase64Memoized}
                                </div>




                            </Draggable>

                            
                                <button style={{width:'0px', height: '30px', position:'absolute' ,right: -8, top: '50%'}}> {''}</button>
                            
                        </Resizable>

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
