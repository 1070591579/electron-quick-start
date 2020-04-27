const { ipcRenderer } = require('electron')
const { $ } = require('./helper')

$('add-music-window').addEventListener('click', () =>{
    ipcRenderer.send('add-music-window')
})

// document.getElementById('add-music-window').addEventListener('click', () =>{
//     ipcRenderer.send('add-music-window')
// })