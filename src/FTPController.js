const remote = window.require('electron').remote;
var ftpClient = remote.getGlobal('ftpClient');
import DirJob from "./DirJob.js"

class FTPController {
    constructor(host, rootDir) {
		this.initRootRemoteDir = this.initRootRemoteDir.bind(this);
		this.connected = this.connected.bind(this);
		this.startUpload = this.startUpload.bind(this);
		this.startDirUpload = this.startDirUpload.bind(this);

		this.rootDir = "/" + rootDir;
		this.client = new ftpClient();
		this.isConnected = false;
		this.currentJob = undefined;
		
		var that = this;
		this.arrDirJobs = [];
		this.arrFileJobs = [];
		this.client.on('ready', function() {
			that.isConnected = true;
			that.connected();
		});
		this.client.connect({
			host:host,
			port: 21,
			user:"upload",
			password:"wilano1337@"
		});
	}
	initRootRemoteDir() {
		var remotePath = this.rootDir;
		var that = this;
		this.createFTPDir(remotePath, function(err){
			if(err) {
				console.error("ROOT DIR INIT " + err);
			}
			else {
				that.startUpload();
			}
		});
	}
	createFTPDir(remotePath, callback) {
		console.log("CREATE DIR " + remotePath);
		this.client.mkdir(remotePath,true,function(err) {
			if(err) {
				console.log(err);
				callback(err);
			}
			else {
				callback(undefined);
			}
		})
	}
	addDirJob(dirJob) {
		this.arrDirJobs.push(dirJob);
		this.startUpload();
	}
	addFileJob(fileJob) {
		this.arrFileJobs.push(fileJob);
		this.startUpload();
	}
	startUpload() {
		if(this.arrDirJobs.length > 0) {
			this.startDirUpload();
		}
		else {
			this.startFileUpload();
		}
	}
	startDirUpload() {
		if(this.currentJob === undefined) {
			this.currentJob = this.arrDirJobs.pop();
			var that = this;
			var remotePath = this.rootDir + this.currentJob.uploadPath;
			this.createFTPDir(remotePath, function(err) {
				if(err) {
					var tmpJob = that.currentJob;
					that.currentJob = undefined;
					that.addDirJob(tmpJob);
				}
				else {
					that.currentJob = undefined;
					that.startUpload();
				}
			});
		}
		else {
			console.error("Job pending");
		}
		
	}
	startFileUpload() {
		
	}
	connected() {
		this.initRootRemoteDir();
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