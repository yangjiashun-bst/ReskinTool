const {contextBridge,ipcRenderer} = require("electron")

contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  browseDir: () => ipcRenderer.invoke("browseDir"),
  readFile: (path) => ipcRenderer.invoke("readFile",path),
  readDir:(path) => ipcRenderer.invoke("readDir",path),
  readImageInfo:(path) => ipcRenderer.invoke("readImageInfo",path),
  saveFile:(path,content) => ipcRenderer.invoke("saveFile",path,content),
  createZip:(path,content) => ipcRenderer.invoke("createZip",path,content)
})
