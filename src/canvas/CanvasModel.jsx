import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';
import Shirt from './Shirt';
import styles from './Canva.module.scss';
import Hoodie from './Hoodie';
import { PaddingTwoTone } from '@mui/icons-material';
import LongSkirt from './LongSkirt';
import LongSkirtModel2 from './LongSkirtModel2';
import WomanSkirtTop from './WomanSkirtTop';
import WomenSkirtDown from './WomenSkirtDown';
import WomenSkirtFull from './WomenSkirtFull';
import React, { useEffect } from 'react';



const CanvasModel = ({ typeOfModel }) => {

    // ---------------UseState Variable---------------//

    // ---------------Usable Variable---------------//
    useEffect(() => {
        console.log('typeOfModel: ', typeOfModel);
    }, [typeOfModel])
    // ---------------UseEffect---------------//
    // ---------------FunctionHandler---------------//


    return (
        <>
            {typeOfModel === 'shirtModel' && (
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 5], fov: 65 }}
                    gl={{ preserveDrawingBuffer: true }}
                    className={styles.canvaContainer}
                >
                    <ambientLight intensity={0.5} />
                    <Environment preset="city" />
                    <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]}>
                        <Shirt />
                    </PresentationControls>
                </Canvas>
            )}

            {typeOfModel === 'hoodieModel' && (
                <Canvas
                shadows
                camera={{ position: [0, 0, 700], fov: 11 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__hoodie}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <Hoodie />
                </PresentationControls>
            </Canvas>
            )}

            {typeOfModel === 'skirtFullModel' && (
                <Canvas
                shadows
                camera={{ position: [0, -10, 5], fov: 35 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__pant}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <WomenSkirtFull />
                </PresentationControls>
            </Canvas>

            )}

            {typeOfModel === 'womenSkirtTopModel' && (
                <Canvas
                shadows
                camera={{ position: [0, -10, 5], fov: 35 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__pant}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <WomanSkirtTop />
                </PresentationControls>
            </Canvas>
            )}

            {typeOfModel === 'womenSkirtBottomModel' && (
                <Canvas
                shadows
                camera={{ position: [0, -10, 5], fov: 35 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__pant}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <WomenSkirtDown />
                </PresentationControls>
            </Canvas>

            )}

            {typeOfModel === 'longSkirtModel' && (
                <Canvas
                shadows
                camera={{ position: [0, 0, 200], fov: 23 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__longSkirt}
                
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0}  >
                        <LongSkirt />
                </PresentationControls>
            </Canvas>
            )}

            {/* {typeOfModel === 'shirtModel' && (
                <Canvas
                shadows
                camera={{ position: [0, 0, 20], fov: 165 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]}>
                    <LongSkirtModel2 />
                </PresentationControls>
            </Canvas>
            )} */}

        </>
    );
};

export default CanvasModel;
