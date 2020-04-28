const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu
} = require('electron')
const DataStore = require('./renderer/MusicDataStore')
const myStore = new DataStore({'name': 'Music Data'})

class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    // Menu.setApplicationMenu(null)
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const finalConfig = {
      ...basicConfig,
      ...config
    }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}
app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html')
  ipcMain.on('add-music-window', (event, arg) => {
    // console.log('hello from index')
    //发送消息的方式
    // event.sender.send('reply', 'hello from main') 
    // mainWindow.send('reply', 'hello from index')
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './renderer/add.html')
  })

  ipcMain.on('add-tracks',(event, tracks)=>{
    console.log(tracks)
    const updateTracks =  myStore.addTracks(tracks).getTracks()
    console.log(updateTracks)
  })

  ipcMain.on('open-music-file', (event) => {
    // console.log('open form add')
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'Music',
        extensions: ['mp3']
      }]
    }
    // (files) => {
    //   console.log(files)
    //   if (files) {
    //     event.sender.send('select-file',files)
    //   }
    // }
    ).then( result => {
      console.log(result)
      if (result) {
        event.sender.send('select-file',result)
      }
    }).catch( err => {
      console.log(err)
    })
  })
})