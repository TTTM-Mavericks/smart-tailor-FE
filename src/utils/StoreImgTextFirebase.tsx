// import React, { useEffect, useState } from "react";
// import { imgDB, txtDB } from "./txtImgConfig";
// import { v4 } from "uuid";
// import {
//   getDownloadURL,
//   ref,
//   uploadBytes,
// } from "firebase/storage";
// import { addDoc, collection, getDocs } from "firebase/firestore";

// function StoreImageTextFirebase() {
//   const [txt, setTxt] = useState('');
//   const [img, setImg] = useState<string | null>(null);
//   const [data, setData] = useState<any[]>([]); // Use a more specific type if possible

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files ? e.target.files[0] : null;
//     if (file) {
//       const imgRef = ref(imgDB, `img-bird/${v4()}`);
//       try {
//         const snapshot = await uploadBytes(imgRef, file);
//         const imgUrl = await getDownloadURL(snapshot.ref);
//         setImg(imgUrl);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }
//   };

//   const handleClick = async () => {
//     if (txt && img) {
//       const valRef = collection(txtDB, 'txtData');
//       try {
//         await addDoc(valRef, { txtVal: txt, imgUrl: img });
//         alert("Data added successfully");
//       } catch (error) {
//         console.error("Error adding data:", error);
//       }
//     }
//   };

//   const getData = async () => {
//     try {
//       const valRef = collection(txtDB, 'txtData');
//       const dataDb = await getDocs(valRef);
//       const allData = dataDb.docs.map((val) => ({ ...val.data(), id: val.id }));
//       setData(allData);
  
//       return allData; // Return the data
//     } catch (error: any) {
//       console.error("Error fetching data:", error);
  
//       // You can handle specific errors here, e.g., permission-denied
//       if (error.code === 'permission-denied') {
//         // Handle permission denied error
//       }
  
//       // Return an empty array or null to indicate an error
//       return null;
//     }
//   };
  

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div>
//       <input onChange={(e) => setTxt(e.target.value)} /><br />
//       <input type="file" onChange={(e) => handleUpload(e)} /><br /><br />
//       <button onClick={handleClick}>Add</button>

//       {data.map((value) => (
//         <div key={value.id}>
//           <h1>{value.txtVal}</h1>
//           {value.imgUrl && (
//             <img
//               src={value.imgUrl}
//               height="200px"
//               width="200px"
//               alt="Uploaded Image"
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default StoreImageTextFirebase;
