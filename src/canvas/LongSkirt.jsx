import { easing } from "maath";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Decal } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useEffect, useMemo, useState } from "react";
import { TextureLoader } from "three";
import state from "../store";
import { systemLogo } from "../assets";


const LongSkirt = ({ isDefault }) => {

    /** @type {[PartOfDesignInterface[], React.Dispatch<React.SetStateAction<PartOfDesignInterface[]>>]} */
    const [modelData, setModelData] = useState();

    /** @type {[ItemMaskInterface[], React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCal, setDecal] = useState();
    const [text, setText] = useState();

    // /** @type {{key:string , items:[ItemMaskInterface[]}, React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCalData, setDecalData] = useState([]);

    const snap = useSnapshot(state)

    const { nodes, materials } = useGLTF('/girls_long_sweater.glb');

    useEffect(() => {
        const loader = new TextureLoader();
        loader.load(systemLogo, (loadedTexture) => {
            setText(loadedTexture);
        });
    }, []);


    useEffect(() => {
        console.log('materials: ', nodes);
        if (isDefault) return;
        if (snap.modelData) {
            setModelData(snap.modelData);
            console.log('snap.modelData: ', snap.modelData);

            // Accumulate all item masks from different parts
            const newDecals = snap.modelData.reduce((acc, item) => {
                if (item.itemMasks) {
                    acc.push({ key: item.partOfDesignName, items: item.itemMasks });
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
                if (item.partOfDesignName === 'LOGO_PART') {
                    setDecal(item.itemMasks);
                }
            })

        }
    }, [modelData]);

    useEffect(() => {
        const loadDecals = async () => {
            const promises = deCalData.reduce((acc, decalGroup) => {
                acc.push(...decalGroup.items.map(async (item) => {
                    try {
                        const texture = await loadTexture(item.imageUrl);
                        // setText(texture); // Ensure this is correctly assigned
                        console.log(`Loaded texture for item ${item.itemMaskID}: `, texture);
                        return { ...item, texture };
                    } catch (error) {
                        console.error(`Failed to load texture for item ${item.itemMaskID}`, error);
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




    const stateString = JSON.stringify(snap)

    const __handleFixPosition = (firstItemMask, key) => {
        if (firstItemMask.position) {
            const A_width = 500; // Example width of div A
            const A_height = 500; // Example height of div A
            const B_width = 170; // Example width of div B
            const B_height = 300; // Example height of div B
            const offsetX = (A_width / 2) - (B_width / 2) - (firstItemMask.scaleX / A_width);
            const offsetY = (A_height / 2) - (B_height / 2) - (firstItemMask.scaleY / A_height);
            let pos;
            pos = [
                // x =
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? (firstItemMask.position.x - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000
                    : key === 'BACK_CLOTH_PART' ? -(firstItemMask.position.x - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000 : 0
                ,
                // y=
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? -(firstItemMask.position.y - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000
                    : key === 'BACK_CLOTH_PART' ? -(firstItemMask.position.y - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000 : 0
                ,
                // z=
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? 0.15
                    :
                    key === 'BACK_CLOTH_PART' ? -0.25
                        : 0
            ];
            return pos;


        }
    }

    const __handleScale = (item) => {
        if (item) {
            return ([item.scaleX / 1000, item.scaleY / 1000, 0.3]);
        }
    }


    const degreesToEuler = (degrees) => {
        const radians = degrees * (Math.PI / 180);
        return radians;
    };


    const loadTexture = (imageUrl) => {
        const loader = new TextureLoader();
        return loader.loadAsync(imageUrl);
    };

    const decalTextures = useMemo(async () => {
        const promises = deCalData.flatMap(decalGroup =>
            decalGroup.items.map(item => loadTexture(item.imageUrl))
        );
        return await Promise.all(promises);
    }, [deCalData]);

    const getTexture = (itemId) => {
        const index = deCalData.flatMap(decalGroup => decalGroup.items).findIndex(item => item.itemMaskID === itemId);
        return decalTextures[index];
    };
    useFrame((state, delta) => easing.dampC(materials.Knit_Terry_FRONT_1356169.color, snap.color, 0.25, delta))

    return (
        <group key={stateString}>
            <mesh
                castShadow
                geometry={nodes.Girls_Long_Sweater_Knit_Terry_FRONT_1356169_0.geometry}
                material={materials.Knit_Terry_FRONT_1356169}
                material-roughness={1}
                scale={[0.5, 0.5, 0.5]}
                position={[0, -50, 0]}
                receiveShadow
                dispose={null}
            >
                {deCalData && deCalData.map((decalGroup) =>
                    decalGroup.items.map((item) => (
                        <>
                            {/* <meshBasicMaterial
                                // attach="material"
                                map={item.texture}
                                // depthWrite={true}
                            /> */}
                        </>
                    ))
                )}


            </mesh>
        </group>
    );
};
export default LongSkirt;