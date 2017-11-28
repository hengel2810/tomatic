const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path')
const url = require('url')
const chokidar = require('chokidar')
const moment = require('moment')
const ftpClient = require('ftp');
const async = require('async');

global.chokidar = chokidar;
global.path = path;
global.moment = moment;
global.ftpClient = ftpClient;
global.async = async;

let mainWindow

function createWindow() {
  	mainWindow = new BrowserWindow({
		width: 300,
		height: 550,
		minWidth: 300,
		resizable: false,
		fullscreen: false
  	})
	mainWindow.setTitle(require('./package.json').name);
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	const menuTemplate = [
		{
			label: 'tomatic',
			submenu: [
				{
					label: 'Quit',
					click: () => {
						app.quit();
					}
				}
			]
		}
	];
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);

	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function() {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  	if (process.platform !== 'darwin') {
    	app.quit()
  	}
})

app.on('activate', function() {
  	if (mainWindow === null) {
    	createWindow()
  	}
})