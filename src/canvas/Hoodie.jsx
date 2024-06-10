import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Decal, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { MeshStandardMaterial } from "three";
import { TextureLoader } from "three";
import * as THREE from 'three'
import state from "../store";

const Hoodie = () => {

    /** @type {[PartOfDesignInterface[], React.Dispatch<React.SetStateAction<PartOfDesignInterface[]>>]} */
    const [modelData, setModelData] = useState();

    /** @type {[ItemMaskInterface[], React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCal, setDecal] = useState();

    // /** @type {{key:string , items:[ItemMaskInterface[]}, React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCalData, setDecalData] = useState([]);

    const snap = useSnapshot(state)

    const { nodes, materials } = useGLTF('/hoodie.glb');
    const [text, setText] = useState();


    useEffect(() => {
        if (snap.modelData) {
            setModelData(snap.modelData);

            // Accumulate all item masks from different parts
            const newDecals = snap.modelData.reduce((acc, item) => {
                if (item.item_mask) {
                    acc.push({ key: item.part_name, items: item.item_mask });
                }
                return acc;
            }, []);

            setDecalData(newDecals);
        }
    }, [snap.modelData]);

    useEffect(() => {
        if (snap.modelData) {
            const reusult = snap.modelData
            setModelData(snap.modelData);
            reusult.map((item) => {
                if (item.part_name === 'LOGO_PART') {
                    setDecal(item.item_mask);
                }
            })

        }
    }, [modelData]);

    useEffect(() => {
        const loadDecals = async () => {
            const promises = deCalData.reduce((acc, decalGroup) => {
                acc.push(...decalGroup.items.map(async (item) => {
                    try {
                        const texture = await loadTexture(item.image_url);
                        console.log('////////////////////////////: ', texture);
                        setText(texture);
                        return { ...item, texture };
                    } catch (error) {
                        console.error(`Failed to load texture for item ${item.item_mask_id}`, error);
                        return null;
                    }
                }));
                return acc;
            }, []);

            const results = await Promise.all(promises);
            setDecalData((prev) => {
                return prev.map((decalGroup, index) => {
                    return {
                        ...decalGroup,
                        items: decalGroup.items.map((item, itemIndex) => {
                            return results[index * decalGroup.items.length + itemIndex] || item;
                        })
                    };
                });
            });
        };

        if (deCalData && deCalData.length > 0) {
            loadDecals();
        }
    }, [modelData]);


    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

    const stateString = JSON.stringify(snap)

    const __handleFixPosition = (firstItemMask, key) => {
        if (firstItemMask.position) {
            const A_width = 500; // Example width of div A
            const A_height = 500; // Example height of div A
            const B_width = 170; // Example width of div B
            const B_height = 300; // Example height of div B
            const offsetX = (A_width / 2) - (B_width / 2) - (firstItemMask.scale_x / A_width);
            const offsetY = (A_height / 2) - (B_height / 2) - (firstItemMask.scale_y / A_height);
            let pos;
            pos = [
                (firstItemMask.position.x - 130 + (firstItemMask.scale_x / 230)) / 1000,
                -(firstItemMask.position.y - 80 + (firstItemMask.scale_y / 230)) / 1000,
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? 0.15
                    :
                    key === 'BACK_CLOTH_PART' ? -0.25
                        : 0
            ];
            return pos;


        }
    }

    const __handleScale = (item) => {
        console.log(item);
        if (item) {
            console.log('[item.scale_x / 1000, item.scale_y / 1000, 0.3]: ', [item.scale_x / 1000, item.scale_y / 1000, 0.3]);
            return ([item.scale_x / 1000, item.scale_y / 1000, 0.3]);
        }
    }




    const loadTexture = (imageUrl) => {
        const loader = new TextureLoader();
        if (loader) {
            return loader.loadAsync(imageUrl);
        }
    };


    return (
        <group key={stateString}>
            <mesh
                castShadow
                geometry={nodes.test_lambert1_0.geometry}
                material={materials.lambert1}
                material-roughness={1}
                scale={[1, 1, 1]}
            >
                            <meshStandardMaterial normalScale={0.2} attach="material" map={text} />

                {/* <meshStandardMaterial normalScale={0.2} attach="material" map={texture} /> */}
                {deCalData && deCalData.map((decalGroup) => (
                    decalGroup.items.map((item) => (
                        <mesh key={item.item_mask_id} position={__handleFixPosition(item, decalGroup.key)} rotation={[0, 0, 0]} scale={__handleScale(item)}>
                            <planeGeometry args={[1, 1]} /> Adjust the size according to your needs
                            <meshStandardMaterial normalScale={0.2} attach="material" map={item.texture} />
                        </mesh>
                    ))
                ))}







            </mesh>
        </group>
    );
};
export default Hoodie;