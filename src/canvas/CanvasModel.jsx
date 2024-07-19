import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, Stage } from '@react-three/drei';
import Shirt from './Shirt';
import styles from './Canva.module.scss';
import Hoodie from './Hoodie';
import LongSkirt from './LongSkirt';
import WomanSkirtTop from './WomanSkirtTop';
import WomenSkirtDown from './WomenSkirtDown';
import WomenSkirtFull from './WomenSkirtFull';
import { OrthographicCamera } from '@react-three/drei';
import NycfashionSkirtModel from './NycfashionSkirtModel';
import Test from './Test';


const CanvasModel = ({ typeOfModel, isDefault, is3D }) => {

    // ---------------UseState Variable---------------//

    // ---------------Usable Variable---------------//

    // ---------------UseEffect---------------//
    // ---------------FunctionHandler---------------//


    return (
        <>
            {typeOfModel === 'shirtModel' && is3D && (
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 5], fov: 65 }}
                    gl={{ preserveDrawingBuffer: true }}
                    className={styles.canvaContainer}
                >
                    <ambientLight intensity={0.5} />
                    <Environment preset="city" />
                    <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]}>
                        <Shirt isDefault={isDefault} />
                    </PresentationControls>
                </Canvas>
            )}

            {/* {typeOfModel === 'shirtModel' && is3D && (
                <Canvas
                    shadows
                    camera={{ position: [-20, -270, 500], fov: 11 }}
                    gl={{ preserveDrawingBuffer: true,  }}
                    className={styles.canvaContainer}

                >
                    <ambientLight intensity={0.5} />
                    <Environment preset="dawn" />
                    <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                        <Test />
                    </PresentationControls>
                </Canvas>
            )} */}

            {typeOfModel === 'shirtModel' && !is3D && (
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 200], fov: 23 }}
                    gl={{ preserveDrawingBuffer: true }}
                    className={styles.canvaContainer__longSkirt}

                >
                    <ambientLight intensity={0.5} />
                    <Environment preset="city" />
                    <Stage>
                        <PresentationControls speed={1.5} global zoom={0}  >
                            <Test />
                        </PresentationControls>
                    </Stage>
                </Canvas>
            )}

            {typeOfModel === 'nycfashionSkirtModel' && is3D && (
                <Canvas
                    shadows
                    camera={{ position: [0, 0, 1000], fov: 35 }}
                    gl={{ preserveDrawingBuffer: true }}
                    className={styles.canvaContainer__hoodie}

                >
                    <ambientLight intensity={0.5} />
                    {/* <Environment preset="city" /> */}
                    <PresentationControls speed={1.5} global zoom={1} polar={[-1, Math.PI / 2]} >
                        <NycfashionSkirtModel />
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
