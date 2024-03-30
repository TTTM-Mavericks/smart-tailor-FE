import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';

import Shirt from './Shirt';
import styles from './Canva.module.scss';

const CanvasModel = () => {

    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 65}}
            gl={{ preserveDrawingBuffer: true }}
            className={styles.canvaContainer}
        >
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]}>
                <Shirt />
            </PresentationControls>
        </Canvas>
    );
};

export default CanvasModel;
