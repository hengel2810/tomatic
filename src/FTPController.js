const remote = window.require('electron').remote;
const ftpClient = remote.getGlobal('ftpClient');
const async = remote.getGlobal('async');
import DirJob from "./DirJob.js"

class FTPController {
    constructor(host, rootDir) {
		this.connected = this.connected.bind(this);
		this.initRootRemoteDir = this.initRootRemoteDir.bind(this);
		this.startUpload = this.startUpload.bind(this);

		this.rootDir = "/" + rootDir;
		this.client = new ftpClient();
		
		this.dirQueue = async.queue(this.createFTPDir, 1);
		this.dirQueue.pause();
		this.dirQueue.drain = function() {
			console.log('all items have been processed');
		};
		this.dirQueue.error(function(error, task) {
			console.error(task);
		});

		var that = this;
		this.client.on('ready', function() {
			that.connected();
		});
		this.client.connect({
			host:host,
			port: 21,
			user:"upload",
			password:"wilano1337@"
		});
	}
	connected() {
		this.initRootRemoteDir();
	}
	initRootRemoteDir() {
		var remotePath = this.rootDir;
		var that = this;
		this.client.mkdir(remotePath,true,function(err) {
			if(err) {
				console.error("ROOT DIR INIT " + err);
			}
			else {
				that.startUpload();
			}
		})
	}
	startUpload() {
		if(this.dirQueue.length() > 0) {
			this.dirQueue.resume();
		}
		else {
			
		}
	}	
	addDirJob(dirJob) {
		dirJob.ftpClient = this.client;
		this.dirQueue.push(dirJob, function(err) {
			if(err) {
				console.error(err);
			}
			else {
				console.log('REMOTE CREATED ' + dirJob.uploadPath);
			}
		});
	}
	createFTPDir(dirJob, callback) {
		if(dirJob.uploadPath) {
			dirJob.ftpClient.mkdir(dirJob.uploadPath,true,function(err) {
				if(err) {
					console.log(err);
					callback(err);
				}
				else {
					callback(undefined);
				}
			})
		}
		else {
			console.error("NO FTP REMOTE PATH");
			callback(undefined);
		}
	}
}

export default FTPController;


// c.put('foo.txt', 'foo.remote-copy.txt', function(err) {
// 	if (err) throw err;
// 	c.end();
// });
// c.mkdir("test/abc/toll",true,function(err) {
// 	console.log(err);
// })