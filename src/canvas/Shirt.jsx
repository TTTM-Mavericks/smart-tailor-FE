import { easing } from "maath";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Decal, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";
import state from "../store";


const Shirt = () => {

    const [position, setPosition] = useState([0, 0, 0]);
    const [scale, setScale] = useState([0, 0, 0]);

    /** @type {[PartOfDesignInterface[], React.Dispatch<React.SetStateAction<PartOfDesignInterface[]>>]} */
    const [modelData, setModelData] = useState();

    /** @type {[ItemMaskInterface[], React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCal, setDecal] = useState()

    const [textureUrl, setTextureUrl] = useState();

    const snap = useSnapshot(state)

    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    const [frontTexture, setFrontTexture] = useState(null);

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
    }, [snap.modelData])

    // useEffect(() => {
    //     if (
    //         modelData &&
    //         modelData.length > 0 &&
    //         modelData[0].item_mask &&
    //         modelData[0].item_mask.length > 0
    //     ) {
    //         const firstItemMask = modelData[0].item_mask[0];
    //         setTextureUrl(firstItemMask.image_url);
    //         setScale([firstItemMask.scale_x / 1000, firstItemMask.scale_y / 1000, 0.3]);
    //         console.log('[firstItemMask.scale_x/1000, firstItemMask_scale_y/1000, 0.3]: ', [firstItemMask.scale_x / 1000, firstItemMask.scale_y / 1000, 0.3]);

    //         if (firstItemMask.position) {
    //             let pos;

    //             if (firstItemMask.position[2] && 'x' in firstItemMask.position[2] && 'y' in firstItemMask.position[2]) {
    //                 pos = [
    //                     firstItemMask.position[2].x / 1000,
    //                     firstItemMask.position[2].y / 1000,
    //                     0
    //                 ];
    //             } else if (firstItemMask.position[1] && 'x' in firstItemMask.position[1] && 'y' in firstItemMask.position[1]) {
    //                 pos = [
    //                     firstItemMask.position[1].x / 1000,
    //                     firstItemMask.position[1].y / 1000,
    //                     0
    //                 ];
    //             } else if ('x' in firstItemMask.position && 'y' in firstItemMask.position) {
    //                 pos = [
    //                     firstItemMask.position.x / 1000,
    //                     firstItemMask.position.y / 1000,
    //                     0
    //                 ];
    //             }

    //             // Check for NaN values
    //             if (pos && !isNaN(pos[0]) && !isNaN(pos[1]) && !isNaN(pos[2])) {
    //                 setPosition(pos);
    //             } else {
    //                 console.error('Position contains NaN values or is undefined:', pos);
    //                 setPosition([0, 0, 0]); // Set to a default valid position
    //             }
    //             console.log('position: ', pos);
    //         }
    //     }
    // }, [modelData]);

    //   const frontTexture = textureUrl ? useTexture(textureUrl) : null;

    // useEffect(() => {
    //     // Example: Update position based on modelData
    //     if (modelData.length > 0 && modelData[0].item_mask.length > 0) {
    //         const newPosition = [modelData[0].item_mask[0].position['1'].x, modelData[0].item_mask[0].position['1'].y, 0];
    //         console.log('newPosition: ', newPosition); // Replace with actual position data from modelData
    //         setPosition(newPosition);
    //     }
    // }, [modelData]);

    // useEffect(() => {
    //     if (textureUrl) {
    //         const loadTexture = async () => {
    //             const texture = await new TextureLoader().loadAsync(textureUrl);
    //             setFrontTexture(texture);
    //             console.log('frontTexture: ', texture);
    //         };
    //         loadTexture();
    //     }
    // }, [textureUrl]);


    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

    const stateString = JSON.stringify(snap)

    const __handleFixPosition = (firstItemMask) => {
        if (firstItemMask.position) {
            let pos;

            if (firstItemMask.position[firstItemMask.item_mask_id] && 'x' in firstItemMask.position[firstItemMask.item_mask_id] && 'y' in firstItemMask.position[2]) {
                pos = [
                    firstItemMask.position[2].x / 1000,
                    firstItemMask.position[2].y / 1000,
                    0.15
                ];
            } else if (firstItemMask.position[firstItemMask.item_mask_id] && 'x' in firstItemMask.position[firstItemMask.item_mask_id] && 'y' in firstItemMask.position[1]) {
                pos = [
                    firstItemMask.position[1].x / 1000,
                    firstItemMask.position[1].y / 1000,
                    0.15
                ];
            } else if ('x' in firstItemMask.position && 'y' in firstItemMask.position) {
                pos = [
                    firstItemMask.position.x / 1000,
                    firstItemMask.position.y / 1000,
                    0.15
                ];
            }

            // Check for NaN values
            if (pos && !isNaN(pos[0]) && !isNaN(pos[1]) && !isNaN(pos[2])) {
                console.log(pos);
                return pos;
            } else {
                console.error('Position contains NaN values or is undefined:', pos);
                return [0, 0, 0]; // Set to a default valid position
            }
        }
    }

    const __handleScale = (item) => {
        console.log(item);
        if (item) {
            console.log('[item.scale_x / 1000, item.scale_y / 1000, 0.3]: ', [item.scale_x / 1000, item.scale_y / 1000, 0.3]);
            return ([item.scale_x / 1000, item.scale_y / 1000, 0.3]);
        }
    }

    useEffect(() => {
        const loadDecals = async () => {
            const promises = deCal.map(async (item) => {
                try {
                    const texture = await loadTexture(item.image_url);
                    return { ...item, texture };
                } catch (error) {
                    console.error(`Failed to load texture for item ${item.item_mask_id}`, error);
                    return null; // Handle failure gracefully
                }
            });

            const results = await Promise.all(promises);
            setDecal(results.filter((item) => item !== null)); // Filter out failed items
        };

        if (deCal && deCal.length > 0) {
            loadDecals();
        }
    }, [modelData]);

    const loadTexture = (imageUrl) => {
        const loader = new TextureLoader();
        return loader.loadAsync(imageUrl);
    };

    return (
        <group key={stateString}>
            <mesh
                castShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={materials.lambert1}
                material-roughness={1}
                scale={[6, 6, 6]}
                dispose={null}
            >

                {deCal && deCal.map((item) => (
                    <Decal
                        // position={[logoDecalPositionX ? logoDecalPositionX : 0, logoDecalPositionY ? logoDecalPositionY : 0, 0.15]}
                        position={__handleFixPosition(item)}
                        key={item.item_mask_id}
                        rotation={[0, 0, 0]}
                        scale={__handleScale(item)}
                        map={item.texture}
                        depthTest={false}
                        depthWrite={true}
                    />
                ))}






            </mesh>
        </group>
    );
};
export default Shirt;