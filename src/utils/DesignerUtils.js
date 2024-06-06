const __downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");
  const dataURL = canvas.toDataURL();
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  console.log(link);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

const __urlToBase64 = (url, callback) => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => new FileReader())
    .then(reader => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => callback(reader.result);
    })
    .catch(error => console.error(error));
}

// const __handleChangeImageToBase64 = async (imageUrl) => {
//   try {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       console.log('Reader.result: ', reader.result);
//     };
//     reader.readAsDataURL(blob);
//   } catch (error) {
//     console.error('Error fetching and converting image:', error);
//   }
// };
const __handleChangeImageToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject('Error reading file as Base64');
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching and converting image:', error);
    throw error;
  }
};

const __handleGenerateItemId = () => {
  // Generate a random alphanumeric string as the item_mask_id
  const randomString = Math.random().toString(36).substring(7);
  return `item_${randomString}`;
};


export { __downloadCanvasToImage, reader, __urlToBase64, __handleChangeImageToBase64, __handleGenerateItemId };