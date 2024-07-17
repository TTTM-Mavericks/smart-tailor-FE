import { easing } from "maath";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, Decal, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";
import state from "../store";


const Shirt = ({ isDefault }) => {

    /** @type {[PartOfDesignInterface[], React.Dispatch<React.SetStateAction<PartOfDesignInterface[]>>]} */
    const [modelData, setModelData] = useState();

    /** @type {[ItemMaskInterface[], React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCal, setDecal] = useState();

    // /** @type {{key:string , items:[ItemMaskInterface[]}, React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
    const [deCalData, setDecalData] = useState([]);

    const snap = useSnapshot(state)

    const { nodes, materials } = useGLTF('/shirt_baked.glb');


    useEffect(() => {
        if (isDefault) return;
        if (snap.modelData) {
            setModelData(snap.modelData);

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


    useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))

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
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? (firstItemMask.positionX - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000
                    : key === 'BACK_CLOTH_PART' ? -(firstItemMask.positionX - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000 : 0
                ,
                // y=
                key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? -(firstItemMask.positionY - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000
                    : key === 'BACK_CLOTH_PART' ? -(firstItemMask.positexturetionY - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000 : 0
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

                {deCalData && deCalData.map((decalGroup) => (
                    decalGroup.items.map((item) => (
                        <Decal
                            position={__handleFixPosition(item, decalGroup.key)}
                            key={item.itemMaskID}
                            rotation={[0, 0, -degreesToEuler(item.rotate)]}
                            scale={__handleScale(item)}
                            map={item.texture}
                            // depthTest={true}
                            depthWrite={true}
                            // dispose={true}
                        />
                    ))
                ))}

            </mesh>
        </group>
    );
};
export default Shirt;