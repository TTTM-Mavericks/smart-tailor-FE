// import { easing } from "maath";
// import { useFrame, useLoader } from "@react-three/fiber";
// import { useGLTF, Decal } from "@react-three/drei";
// import { useSnapshot } from "valtio";
// import { useEffect, useState } from "react";
// import { TextureLoader } from "three";
// import state from "../store";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


// const Test = ({ isDefault }) => {

//     /** @type {[PartOfDesignInterface[], React.Dispatch<React.SetStateAction<PartOfDesignInterface[]>>]} */
//     const [modelData, setModelData] = useState();

//     /** @type {[ItemMaskInterface[], React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
//     const [deCal, setDecal] = useState();
//     const [text, setText] = useState();

//     // /** @type {{key:string , items:[ItemMaskInterface[]}, React.Dispatch<React.SetStateAction<ItemMaskInterface[]>>]} */
//     const [deCalData, setDecalData] = useState([]);

//     const snap = useSnapshot(state)

//     const { nodes, materials } = useGLTF('/oversized_t-shirt.glb');

//     useEffect(() => {
//         console.log('materials: ', materials);
//         if (isDefault) return;
//         if (snap.modelData) {
//             setModelData(snap.modelData);
//             console.log('snap.modelData: ', snap.modelData);

//             // Accumulate all item masks from different parts
//             const newDecals = snap.modelData.reduce((acc, item) => {
//                 if (item.itemMasks) {
//                     acc.push({ key: item.partOfDesignName, items: item.itemMasks });
//                 }
//                 return acc;
//             }, []);

//             setDecalData(newDecals);
//         }
//     }, [snap.modelData]);

//     useEffect(() => {
//         if (snap.modelData) {
//             const reusult = snap.modelData
//             setModelData(snap.modelData);
//             reusult.map((item) => {
//                 if (item.partOfDesignName === 'LOGO_PART') {
//                     setDecal(item.itemMasks);
//                 }
//             })

//         }
//     }, [modelData]);

//     useEffect(() => {
//         const loadDecals = async () => {
//             const promises = deCalData.reduce((acc, decalGroup) => {
//                 acc.push(...decalGroup.items.map(async (item) => {
//                     try {
//                         const texture = await loadTexture(item.imageUrl);
//                         setText(texture);
//                         return { ...item, texture };
//                     } catch (error) {
//                         console.error(`Failed to load texture for item ${item.itemMaskID}`, error);
//                         return null;
//                     }
//                 }));
//                 return acc;
//             }, []);

//             const results = await Promise.all(promises);
//             setDecalData((prev) => {
//                 return prev.map((decalGroup, index) => {
//                     return {
//                         ...decalGroup,
//                         items: decalGroup.items.map((item, itemIndex) => {
//                             return results[index * decalGroup.items.length + itemIndex] || item;
//                         })
//                     };
//                 });
//             });
//         };

//         if (deCalData && deCalData.length > 0) {
//             loadDecals();
//         }
//     }, [modelData]);



//     const stateString = JSON.stringify(snap)

//     const __handleFixPosition = (firstItemMask, key) => {
//         if (firstItemMask.position) {
//             const A_width = 500; // Example width of div A
//             const A_height = 500; // Example height of div A
//             const B_width = 170; // Example width of div B
//             const B_height = 300; // Example height of div B
//             const offsetX = (A_width / 2) - (B_width / 2) - (firstItemMask.scaleX / A_width);
//             const offsetY = (A_height / 2) - (B_height / 2) - (firstItemMask.scaleY / A_height);
//             let pos;
//             pos = [
//                 // x =
//                 key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? (firstItemMask.position.x - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000
//                     : key === 'BACK_CLOTH_PART' ? -(firstItemMask.position.x - 130 + (firstItemMask.scaleX / 230) + (firstItemMask.scaleX - 230) / 2) / 1000 : 0
//                 ,
//                 // y=
//                 key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? -(firstItemMask.position.y - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000
//                     : key === 'BACK_CLOTH_PART' ? -(firstItemMask.position.y - 80 + (firstItemMask.scaleY / 230) + (firstItemMask.scaleY - 230) / 2) / 1000 : 0
//                 ,
//                 // z=
//                 key === 'LOGO_PART' || key === 'FRONT_CLOTH_PART' ? 0.15
//                     :
//                     key === 'BACK_CLOTH_PART' ? -0.25
//                         : 0
//             ];
//             return pos;


//         }
//     }

//     const __handleScale = (item) => {
//         if (item) {
//             return ([item.scaleX / 1000, item.scaleY / 1000, 0.3]);
//         }
//     }


//     const degreesToEuler = (degrees) => {
//         const radians = degrees * (Math.PI / 180);
//         return radians;
//     };


//     const loadTexture = (imageUrl) => {
//         const loader = new TextureLoader();
//         return loader.loadAsync(imageUrl);
//     };

//     useEffect(() => {
//         console.log('snap.color: ', snap.color);
//     }, [snap.color])
//     useFrame((state, delta) => easing.dampC(materials['Material.001'].color, snap.color, 0.25, delta))

//     return (
//         <group key={stateString}>
//             <mesh
//                 castShadow
//                 geometry={nodes['Object_3'].geometry}
//                 material={materials['Material.001']}
//                 material-roughness={1}
//                 scale={[6, 6, 6]}
//                 dispose={null}
//             >
//                 {/* <meshBasicMaterial  attach="material" map={text}/> */}
//                 <>

//                 <meshStandardMaterial map={text} depthTest={true} depthWrite={true} />
//                 </>


//                 {deCalData && deCalData.map((decalGroup) =>
//                     decalGroup.items.map((item) => (
//                         <Decal
//                             key={item.itemMaskID}
//                             position={__handleFixPosition(item, decalGroup.key)}
//                             rotation={[0, 0, -degreesToEuler(item.rotate)]}
//                             scale={__handleScale(item)}
//                             map={item.texture}
//                             depthTest={true}
//                             depthWrite={true}
//                             renderOrder={item.indexZ} // Assuming indexZ controls the rendering order
//                         />
//                     ))
//                 )}

//             </mesh>
//         </group>
//     );
// };

import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { systemLogo } from "../assets";
import { useEffect, useRef, useState } from "react";
import state from "../store";
import { useSnapshot } from "valtio";
import { useGLTF } from "@react-three/drei";

const Test = () => {
    const { scene } = useGLTF('/hoodie.glb');
    const texture = useLoader(THREE.TextureLoader, systemLogo);

    // Shader material with updated code
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                });

                const uvAttribute = child.geometry.attributes.uv;
                const uvArray = uvAttribute.array;

                // Adjust UV coordinates to map the texture to a 50x50 area
                const scale = 0.4; // Scale down to cover a smaller area
                const offsetX = 0.45; // Adjust offset to position the texture
                const offsetY = 0.45; // Adjust offset to position the texture

                for (let i = 0; i < uvArray.length; i += 2) {
                    uvArray[i] = uvArray[i] * scale + offsetX; // Adjust U
                    uvArray[i + 1] = uvArray[i + 1] * scale + offsetY; // Adjust V
                }

                uvAttribute.needsUpdate = true;
                child.material = material;
                child.material.needsUpdate = true;
            }
        });
    }, [scene, texture]);

    return (
        <primitive object={scene} dispose={null} />
    );
};

export default Test;
