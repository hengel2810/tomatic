const electron = require('electron')
const app = electron.app
const dialog = require('electron').dialog
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')
const chokidar = require('chokidar')
const moment = require('moment')
const ftpClient = require('ftp');

global.chokidar = chokidar;
global.path = path;
global.moment = moment;
global.ftpClient = ftpClient;

function upload() {
   
	// var c = new Client();
	// c.on('ready', function() {
	//   	c.put('foo.txt', 'foo.remote-copy.txt', function(err) {
	// 		if (err) throw err;
	// 		c.end();
	// 	});
	// 	c.mkdir("test/abc/toll",true,function(err) {
	// 		console.log(err);
	// 	})
	// });
	// var config = {
	// 	host:"192.168.188.35",
	// 	port: 21,
	// 	user:"upload",
	// 	password:"wilano1337@"
    // };
	// c.connect(config);


    // var config = {
	// 	host:"192.168.188.35",
	// 	port: 21,
	// 	user:"upload",
	// 	password:"wilano1337@"
    // };
    // var options = {
    //     logging: 'basic'
    // };
    // var client = new ftpClient(config, options);
 
	// var path = '/User/henrikengelbrink/Coden/pythonOpenCV';
	// // var path = '../pythonOpenCV/**'
	// client.connect(function () {
	// 	client.upload([path], '/', {
	// 		overwrite: 'older'
	// 	}, function (result) {
	// 		console.log(result);
	// 	});
	// });
}
// global.upload = upload;

upload();

let mainWindow

function createWindow() {
  	mainWindow = new BrowserWindow({
		width: 800,//500,
		height: 600,
		minWidth: 300,
		resizable: false,
		fullscreen: false
  	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.webContents.openDevTools()

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