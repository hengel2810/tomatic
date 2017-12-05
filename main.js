const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const {crashReporter} = require('electron');

const path = require('path')
const url = require('url')
const chokidar = require('chokidar')
const ftpClient = require('ftp');
const async = require('async');

global.chokidar = chokidar;
global.path = path;
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

	crashReporter.start({
		productName: "tomatic",
		companyName: "hengel2810",
		submitURL: "https://hengel2810.sp.backtrace.io:6098/post?format=minidump&token=c2e7c4e8f7b2a4970e6d08d93a084b97890e1b45e0d992532c81a3b6b96a432c",
		uploadToServer: true
	});
	console.log(crashReporter.getLastCrashReport());
}

app.on('ready', function() {
	createWindow();
	// setTimeout(function(){process.crash(); return true;}, 3000)
})

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