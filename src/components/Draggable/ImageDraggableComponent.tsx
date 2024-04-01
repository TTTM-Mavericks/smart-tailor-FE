import React, { useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import styles from './ImageDraggableStyle.module.scss';
import { useSnapshot } from 'valtio';
import state from '../../store';
import { BACK_CLOTH_PART, FRONT_CLOTH_PART, LOGO_PART, PartOfCloth, SLEEVE_CLOTH_PART } from '../../models/ClothModel';

type props = {
    partOfCloth?: PartOfCloth,
    selectedItem?: string
}

const ImageDraggableComponent: React.FC<props> = ({ partOfCloth, selectedItem }) => {
    // ---------------UseState Variable---------------//
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [imgBase64, setImgBase64] = useState<string | undefined>();

    // ---------------Usable Variable---------------//
    const snap = useSnapshot(state);

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

    useEffect(() => {
        // Get the dimensions of the boundary container
        const boundaryContainer = document.querySelector(`.${styles.imageDraggable__boundary}`);
        if (boundaryContainer) {
            const boundaryRect = boundaryContainer.getBoundingClientRect();

            // Calculate initial position to center the image
            const initialX = (boundaryRect.width - 100) / 2; // Assuming image width is 100px
            const initialY = (boundaryRect.height - 100) / 2; // Assuming image height is 100px

            // setPosition({ x: initialX, y: initialY });
            console.log('x: ', initialX, '-y: ', initialY);
        }
    }, []);


    // ---------------FunctionHandler---------------//

    const handleDrag = (e: DraggableEvent, ui: DraggableData) => {
        const { x, y } = ui;
        setPosition({ x, y });
        if (selectedItem === LOGO_PART) {
            state.logoDecalPositionX = ui.x;
            state.logoDecalPositionY = ui.y;
            console.log('---logo');
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
    };

    const handleStop = (e: DraggableEvent, ui: DraggableData) => {
        const { x, y } = ui;
        setPosition({ x, y });
        console.log('Drag stopped at:', x, y);
        if (selectedItem === LOGO_PART) {
            state.logoDecalPositionX = ui.x;
            state.logoDecalPositionY = ui.y;
            console.log('---logo');
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
    };

    return (
        <>

            {partOfCloth ? (
                <div className={styles.imageDraggable__boundary} style={{ backgroundImage: partOfCloth?.imgUrl }}>
                    <div>
                        <img src={partOfCloth.imgUrl} className={styles.imageDraggable__img} ></img>
                        <Draggable
                            // bounds="parent"
                            position={position}
                            onDrag={handleDrag}
                            onStop={handleStop}
                        >
                            <div className={styles.imageDraggable__container}>
                                {imgBase64 && (
                                    <img src={imgBase64} style={{ width: '100%', height: '400px', pointerEvents: 'none' }} alt="Draggable Image" />
                                )}
                            </div>
                        </Draggable>
                    </div>



                </div>
            ) : (
                <div className={styles.imageDraggable__boundary}>
                    Choose part of cloth
                </div>
            )}


        </>
    );
}

export default ImageDraggableComponent;
