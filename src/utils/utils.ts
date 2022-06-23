export const getUUID = () => {
  return Math.random().toString(36).substring(3, 19)
}
export const getFilePathById = (imagesFilePath, imageId: string, pixelSize?: number) => {
  if (imagesFilePath == null || imagesFilePath.length == 0) {
    return false
  }
  for (let i = 0; i < imagesFilePath.length; i++) {
    const fileName = getFileName(imagesFilePath[i])
    if (pixelSize) {
      if (pixelSize === 3 && fileName === imageId && imagesFilePath[i].endsWith(".jpg")) {
        return imagesFilePath[i]
      } else if (pixelSize === 4 && fileName === imageId && imagesFilePath[i].endsWith(".png")) {
        return imagesFilePath[i]
      }
    } else {
      if (fileName === imageId && (imagesFilePath[i].endsWith(imageId + ".jpg") || imagesFilePath[i].endsWith(imageId + ".png"))) {
        return imagesFilePath[i]
      }
    }

  }
  return false
}
export const getFileNameAndSuffix = (path: string) => {
  let pos = path.lastIndexOf("\\");
  if (pos !== -1) {
    return path.substring(pos + 1)
  }
  return "";
}
export const getFileName = (path: string) => {
  let startPos = path.lastIndexOf("\\");
  let endPos = path.lastIndexOf(".");
  if (startPos !== -1) {
    return path.substring(startPos + 1, endPos)
  }
  return "";
}
export const transImageAreaToCanvas = (srcArea, srcSize, dstSize) => {
  if (!srcArea) {
    return
  }
  const dx = 1.0 * srcSize.width / dstSize.width
  const dy = 1.0 * srcSize.height / dstSize.height

  return {
    "x": Math.floor(srcArea.x / dx), "y": Math.floor(srcArea.y / dy),
    "width": Math.floor(srcArea.w / dx), "height": Math.floor(srcArea.h / dy)
  }
}
export const transCanvasAreaToImage = (srcArea, srcSize, dstSize) => {
  if (!srcArea) {
    return
  }
  const dx = 1.0 * srcSize.width / dstSize.width
  const dy = 1.0 * srcSize.height / dstSize.height

  return {
    "x": Math.floor(srcArea.x / dx), "y": Math.floor(srcArea.y / dy),
    "w": Math.floor(srcArea.w / dx), "h": Math.floor(srcArea.h / dy)
  }
}

export const isBackgroundImg = (imgId: string) => {

  if (imgId.endsWith("_bg")) {
    return true
  }
  return false
}


export const isJSON = (str: string) => {
  try {
    const obj = JSON.parse(str);
    if (typeof obj === "object" && obj) {
      return true
    }
  } catch (e) {
    console.log("err:", e);
  }
  return false
}
export const isDev = () => {
  const {NODE_ENV} = process.env;
  return NODE_ENV === "development";
}
