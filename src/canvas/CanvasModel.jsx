import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';

import Shirt from './Shirt';
import styles from './Canva.module.scss';
import Hoodie from './Hoodie';
import { PaddingTwoTone } from '@mui/icons-material';
import Pant from './Pant';
import LongShirt from './LongShirt';

const CanvasModel = () => {

    return (
        <>

            {/* <Canvas
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
        </Canvas> */}

            {/* <Canvas
                shadows
                camera={{ position: [0, 0, 700], fov: 10 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__hoodie}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <Hoodie />
                </PresentationControls>
            </Canvas> */}

            {/* <Canvas
                shadows
                camera={{ position: [0.5, -10, 5], fov: 35 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__pant}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <Pant />
                </PresentationControls>
            </Canvas> */}

            <Canvas
                shadows
                camera={{ position: [0, 0, 50], fov: 65 }}
                gl={{ preserveDrawingBuffer: true }}
                className={styles.canvaContainer__longShirt}
            >
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <PresentationControls speed={1.5} global zoom={0.7} polar={[-1, Math.PI / 2]} >
                    <LongShirt />
                </PresentationControls>
            </Canvas>


        </>
    );
};

export default CanvasModel;
