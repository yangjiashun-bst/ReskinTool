const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require("fs")
const imagesizeof = require("image-size")
const httpServer = require("http-server")
const {APP_ENV} = process.env;
const RES_DIR = "reskin_res";

function getFileNameAndSuffix(path) {
  let pos = path.lastIndexOf("\\");
  if (pos !== -1) {
    return path.substring(pos + 1)
  }
  return "";
}

function getFileName(path) {
  let startPos = path.lastIndexOf("\\");
  let endPos = path.lastIndexOf(".");
  if (startPos !== -1) {
    return path.substring(startPos + 1, endPos)
  }
  return "";
}

async function removeDir(path) {
  const files = fs.readdirSync(path)
  files.forEach(file => {
    const filePath = `${path}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      removeDir(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  })
}

async function handleBrowseDir() {
  const {canceled, filePaths} = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  })
  if (canceled) {
    return false;
  } else {
    return filePaths[0];
  }
}

function getDirFile(path) {
  const stat = fs.statSync(path)
  let result = []
  if (stat.isDirectory()) {
    const dir = fs.readdirSync(path)
    for (let i = 0; i < dir.length; i++) {
      if(dir[i] === RES_DIR)
          continue;
      const newPath = path + "\\" + dir[i]
      const tempPathList = getDirFile(newPath)
      if (tempPathList.length > 0) {
        result = result.concat(tempPathList)
      }
    }
    return result
  } else {
    return [path]
  }
}

async function handleDirFile(event, path) {

  if (fs.existsSync(path)) {
    return getDirFile(path)
  }
  return false;
}

async function handleReadImageInfo(event, path) {

  if (fs.existsSync(path)) {
    return imagesizeof(path)
  }
  return false;
}

async function handleReadFile(event, path) {

  if (fs.existsSync(path))
    return fs.readFileSync(path, {encoding: "utf-8"})
  return false
}

async function handeSaveFile(event, path, content) {

  fs.writeFileSync(path, content)
  return true
}

async function handleCreateZip(event, path, content) {
  const json = JSON.parse(content)
  const dirPath = path + "\\"+RES_DIR+"\\"
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  } else {
    await removeDir(dirPath)
  }
  await handeSaveFile(event, dirPath + "texturemap.cfg", content)
  const {images} = json
  if (images && images.length > 0) {
    const files = getDirFile(path)
    images.forEach(image => {
      const {imageId, previewUrl, glbUrl, coverUrl} = image
      files.map(file => {
        const fileName = getFileName(file)
        const fileNameAndSuffix = getFileNameAndSuffix(file)
        if (!fs.existsSync(dirPath + fileNameAndSuffix)) {
          if (fileName === imageId ||
            previewUrl === fileNameAndSuffix ||
            (glbUrl && glbUrl === fileNameAndSuffix) ||
            (coverUrl && coverUrl === fileNameAndSuffix)) {
            fs.copyFileSync(file, dirPath + fileNameAndSuffix)
          }
        }
      })
    })
  }

}

function createWindow() {
  if (APP_ENV !== "dev") {
    httpServer.createServer({root: path.join(__dirname, "./dist")}).listen(8000)
  }

  const win = new BrowserWindow({
    width: 1250,
    height: 950,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: APP_ENV !== "dev"
  })
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  win.loadURL('http://localhost:8000')
  // win.maximize()
}

app.whenReady().then(() => {
  ipcMain.handle("browseDir", handleBrowseDir)
  ipcMain.handle("readFile", handleReadFile)
  ipcMain.handle("readDir", handleDirFile)
  ipcMain.handle("readImageInfo", handleReadImageInfo)
  ipcMain.handle("saveFile", handeSaveFile)
  ipcMain.handle("createZip", handleCreateZip)

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
