// export async function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
//   const image = await createImage(imageSrc);
// console.log(image)
// console.log("hhhh")
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   const naturalWidth = image.naturalWidth;
//   const naturalHeight = image.naturalHeight;

//   const cropWidth = (naturalWidth / zoom) * (crop.width / 100);
//   const cropHeight = (naturalHeight / zoom) * (crop.height / 100);
//   const cropX = (naturalWidth / 100) * crop.x;
//   const cropY = (naturalHeight / 100) * crop.y;

//   canvas.width = cropWidth;
//   canvas.height = cropHeight;

//   ctx.drawImage(
//     image,
//     cropX,
//     cropY,
//     cropWidth,
//     cropHeight,
//     0,
//     0,
//     cropWidth,
//     cropHeight
//   );

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => {
//       resolve(blob);
//     }, "image/jpeg", 0.9);
//   });
// }

// function createImage(url) {
// console.log(url)
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.addEventListener("load", () => resolve(img));
//     img.addEventListener("error", (err) => reject(err));
//     img.setAttribute("crossOrigin", "anonymous");
//     img.src = url;
//   });
// }


// getCroppedImg.js
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });

export async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const { x, y, width, height } = croppedAreaPixels;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.9);
  });
}