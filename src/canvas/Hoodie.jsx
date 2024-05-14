import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Decal, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import state from '../store'
import { useEffect, useState } from "react";


const Hoodie = () => {

    const [logoDecalPositionX, setLogoDecalPositionX] = useState(0);
    const [logoDecalPositionY, setLogoDecalPositionY] = useState(0);

    const [frontDecalPositionX, setFrontDecalPositionX] = useState(0);
    const [frontDecalPositionY, setFrontDecalPositionY] = useState(0);

    const [backDecalPositionX, setBackDecalPositionX] = useState(0);
    const [backDecalPositionY, setBackDecalPositionY] = useState(0);

    const [sleeveDecalPositionX, setSleeveDecalPositionX] = useState(0);
    const [sleeveDecalPositionY, setSleeveDecalPositionY] = useState(0);

    const snap = useSnapshot(state)

    const { nodes, materials } = useGLTF('/hoodie.glb');


    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);
    const frontTexture = useTexture(snap.frontClothDecal);
    const backTexture = useTexture(snap.backClothDecal);
    const sleeveTexture = useTexture(snap.sleeveClothDecal);



    useEffect(() => {
        if (snap.isLogoTexture) {

            if (snap.logoDecalPositionX / 1000 !== 0) {
                if (snap.logoDecalPositionX / 1000 < 0.2) {

                    setLogoDecalPositionX(snap.logoDecalPositionX / 1000)
                } else {
                    setLogoDecalPositionX(-snap.logoDecalPositionX / 1000)

                }

            }

            if (snap.logoDecalPositionY !== 0) {
                if (snap.logoDecalPositionY / 1000 < 0.2) {

                    setLogoDecalPositionY(-snap.logoDecalPositionY / 1000)
                } else {
                    setLogoDecalPositionY(snap.logoDecalPositionY / 1000)

                }

            }

        }

        if (snap.isFrontClothTexture) {

            if (snap.frontDecalPositionX / 1000 !== 0) {
                if (snap.frontDecalPositionX / 1000 < 0.2) {

                    setFrontDecalPositionX(snap.frontDecalPositionX / 1000)
                } else {
                    setFrontDecalPositionX(-snap.frontDecalPositionX / 1000)

                }

            }

            if (snap.frontDecalPositionY !== 0) {
                if (snap.frontDecalPositionY / 1000 < 0.2) {

                    setFrontDecalPositionY(-snap.frontDecalPositionY / 1000)
                } else {
                    setFrontDecalPositionY(snap.frontDecalPositionY / 1000)

                }

            }

        }

        if (snap.isBackClothTexture) {

            if (snap.backDecalPositionX / 1000 !== 0) {
                if (snap.backDecalPositionX / 1000 < 0.2) {

                    setBackDecalPositionX(snap.backDecalPositionX / 1000)
                } else {
                    setBackDecalPositionX(-snap.backDecalPositionX / 1000)

                }

            }

            if (snap.backDecalPositionY !== 0) {
                if (snap.backDecalPositionY / 1000 < 0.2) {

                    setBackDecalPositionY(-snap.backDecalPositionY / 1000)
                } else {
                    setBackDecalPositionY(snap.backDecalPositionY / 1000)

                }

            }

        }

        if (snap.isSleeveClothTexture) {

            if (snap.sleeveDecalPositionX / 1000 !== 0) {
                if (snap.sleeveDecalPositionX / 1000 < 0.2) {

                    setSleeveDecalPositionX(snap.sleeveDecalPositionX / 1000)
                } else {
                    setSleeveDecalPositionX(-snap.sleeveDecalPositionX / 1000)

                }

            }

            if (snap.sleeveDecalPositionY !== 0) {
                if (snap.sleeveDecalPositionY / 1000 < 0.2) {

                    setSleeveDecalPositionY(-snap.sleeveDecalPositionY / 1000)
                } else {
                    setSleeveDecalPositionY(snap.sleeveDecalPositionY / 1000)

                }

            }

        }


        // Vị trí ban đầu của phần tử con
        const initialPositionX = snap.logoDecalPositionX;
        const initialPositionY = snap.logoDecalPositionY;

        // Vị trí ban đầu của phần tử khác
        const otherElementX = 0;
        const otherElementY = 0;

        // Sự chênh lệch giữa hai vị trí theo trục X và trục Y
        const deltaX = initialPositionX - otherElementX;
        const deltaY = initialPositionY - otherElementY;

        // Tính toán tỉ lệ
        const scaleRatioX = deltaX / otherElementX;
        const scaleRatioY = deltaY / otherElementY;

        console.log(nodes, materials)





    }, [snap])




    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

    const stateString = JSON.stringify(snap)

    return (
        <group key={stateString}>
            <mesh
                castShadow
                geometry={nodes.test_lambert1_0.geometry}
                material={materials.lambert1}
                material-roughness={1}
                scale={[1, 1, 1]}
                dispose={null}
            >
                {snap.isFullTexture && (
                    <Decal
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={1}
                        map={fullTexture}
                    />
                )}

                {snap.isLogoTexture && (
                    <Decal
                        // position={[logoDecalPositionX ? logoDecalPositionX : 0, logoDecalPositionY ? logoDecalPositionY : 0, 0.15]}
                        position={[0, 0.04, 0.15]}

                        rotation={[0, 0, 0]}
                        scale={0.1}
                        map={logoTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}


                {snap.isFrontClothTexture && (
                    <Decal
                        position={[frontDecalPositionX ? frontDecalPositionX : 0, frontDecalPositionY ? frontDecalPositionY : 0, 0.15]}
                        // position={[0, 0.04, 0.15]}

                        rotation={[0, 0, 0]}
                        scale={0.35}
                        map={frontTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}

                {snap.isBackClothTexture && (
                    <Decal
                        position={[0, backDecalPositionY ? backDecalPositionY : 0, -0.25]}
                        // position={[0, 0.01, 0.2]}

                        rotation={[0, 0, 0]}
                        scale={0.5}
                        map={backTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}

                {snap.isSleeveClothTexture && (
                    <Decal
                        // position={[sleeveDecalPositionX ? sleeveDecalPositionX/10 : 0, sleeveDecalPositionY ? sleeveDecalPositionY : 0, 0]}
                        position={[-0.15, 0.15, 0]}

                        rotation={[0, 0, 0]}
                        scale={0.2}
                        map={sleeveTexture}
                        depthTest={false}
                        depthWrite={true}
                    />
                )}


            </mesh>
        </group>
    );
};
export default Hoodie;