const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios');

const notifyBtn = document.getElementById('notifyBtn')

const ipc = electron.ipcRenderer

notifyBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, 'add.html')
  let win = new BrowserWindow({
        frame: false,
        width: 400,
        height: 200,
        transparent: true, 
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
  // win.webContents.openDevTools()
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})


var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal;

function getUSD() {
  let myNotification = ''
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=USD&tsyms=Rub')
  .then(res => {
      const cryptos = res.data.USD.RUB
      price.innerHTML = cryptos.toLocaleString('en')
  
      if (targetPrice.innerHTML != '' && targetPriceVal < cryptos) {
        myNotification = new window.Notification(notification.title, notification)
      }

      myNotification.onclick = () => {
          console.log('clicked')
      }
  })
}

getUSD();
setInterval ( getUSD, 30000 );

ipc.on('targetPriceVal', function (event, arg) {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = targetPriceVal.toLocaleString('en')
})


const notification = {
    title: 'USD Alert',
    body: 'USD just beat your target price!',
    icon: path.join(__dirname, '../assets/images/icon.png')
}