const remote = window.require('electron').remote;
const ftpClient = remote.getGlobal('ftpClient');
const async = remote.getGlobal('async');

class FTPController {
    constructor(config, rootDir, ftpConnect) {
		this.connected = this.connected.bind(this);
		this.initRootRemoteDir = this.initRootRemoteDir.bind(this);
		this.setSync = this.setSync.bind(this);
		this.startSync = this.startSync.bind(this);
		this.addPutDirJob = this.addPutDirJob.bind(this);
		this.addRemoveDirJob = this.addRemoveDirJob.bind(this);
		this.handleDirJob = this.handleDirJob.bind(this);
		this.handlePutDirJob = this.handlePutDirJob.bind(this);
		this.handleRemoveDirJob = this.handleRemoveDirJob.bind(this);
		this.handleFileJob = this.handleFileJob.bind(this);
		
		this.synchronizing = config.synchronizing;
		this.rootDir = "/" + rootDir;
		this.client = new ftpClient();
		this.isSyncing = false;
		this.ftpConnect = ftpConnect;
		
		this.putDirQueue = async.queue(this.handleDirJob, 1);
		this.putDirQueue.pause();
		this.putDirQueue.error(function(error, task) {
			console.error(task);
		});

		this.removeDirQueue = async.queue(this.handleDirJob, 1);
		this.removeDirQueue.pause();
		this.removeDirQueue.error(function(error, task) {
			console.error(task);
		});

		this.fileQueue = async.queue(this.handleFileJob, 1);
		this.fileQueue.pause();
		this.fileQueue.error(function(error, task) {
			console.error(task);
		});

		var that = this;
		this.client.on('ready', function() {
			if(that.ftpConnect) {
				that.ftpConnect(undefined);
			}
			that.connected();
		});
		this.client.on('error', function(err) {
			if(that.ftpConnect) {
				that.ftpConnect(err);
			}
			console.error(err);
		});
		this.client.connect({
			host:config.host,
			port: 21,
			user:config.user,
			password:config.password
		});
	}
	check
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
				that.startSync();
			}
		})
	}
	setSync() {
		var putDirQueueCount = this.putDirQueue.length();
		var fileQueueCount = this.fileQueue.length()
		var removeDirQueueCount = this.removeDirQueue.length();
		
		if(putDirQueueCount === 0 && fileQueueCount === 0 && removeDirQueueCount === 0) {
			if(this.isSyncing === true) {
				this.synchronizing(false);
			}
			this.isSyncing = false;
		}
		else {
			if(this.isSyncing === false) {
				this.synchronizing(true);
			}
			this.isSyncing = true;
		}
	}
	startSync() {
		var putDirQueueCount = this.putDirQueue.length();
		var fileQueueCount = this.fileQueue.length()
		var removeDirQueueCount = this.removeDirQueue.length();
		if(putDirQueueCount > 0) {
			this.putDirQueue.resume();
		}
		else if(putDirQueueCount === 0 && fileQueueCount > 0) {
			this.fileQueue.resume();
		}
		else if(putDirQueueCount === 0 && fileQueueCount === 0 && removeDirQueueCount > 0) {
			this.removeDirQueue.resume();
		}
		this.setSync();
	}	
	addPutDirJob(putDirJob) {
		this.fileQueue.pause();
		var that = this;
		this.putDirQueue.push(putDirJob, function(err) {
			if(err) {
				console.error(err);
			}
			else {
				// console.log('DIR ADDED ' + putDirJob.remotePath);
				if(that.putDirQueue.length() === 0) {
					that.startSync();
				}
			}
		});
	}
	addRemoveDirJob(removeDirJob) {
		var that = this;
		this.removeDirQueue.push(removeDirJob, function(err) {
			if(err) {
				console.error(err);
			}
			else {
				// console.log('DIR REMOVED ' + removeDirJob.remotePath);
			}
		});
	}
	addFileJob(fileJob) {
		var that = this;
		this.fileQueue.push(fileJob, function(err) {
			if(err) {
				console.error(err);
			}
			else {
				// console.log('FILE EDITED ' + fileJob.remotePath);
				if(that.fileQueue.length() === 0) {
					that.startSync();
				}
			}
		});
	}
	handleDirJob(dirJob, callback) {
		if(dirJob.remotePath) {
			if(dirJob.type ===  "putDir") {
				this.handlePutDirJob(dirJob, callback);
			}
			else if(dirJob.type ===  "removeDir") {
				this.handleRemoveDirJob(dirJob, callback);
			}
			else {
				var err = new Error("WRONG DIRJOB TYPE " + dirJob.type)
				console.error(err)
				callback();
			}
		}
		else {
			var err = new Error("DIR NO FTP REMOTE PATH");
			console.error(err);
			callback();
		}
	}
	handlePutDirJob(dirJob, callback) {
				this.client.mkdir(dirJob.remotePath,true,function(err) {
					if(err) {
						console.error(err);
						callback()
					}
					else {
						callback()
					}
				})
	}
	handleRemoveDirJob(dirJob, callback) {
				this.client.rmdir(dirJob.remotePath, true, function(err) {
					if(err) {
						console.error(err);
						callback()
					}
					else {
						callback()
					}
				})
	}
	handleFileJob(fileJob, callback) {
		if(fileJob.remotePath && fileJob.localPath) {
			if(fileJob.type ===  "putFile") {
				this.client.put(fileJob.localPath, fileJob.remotePath, function(err) {
					if(err) {
						console.error(err);
						callback();
					}
					else {
						callback();
					}
				})
			}
			else if(fileJob.type ===  "removeFile") {
				this.client.delete(fileJob.remotePath, function(err) {
					if(err) {
						console.error(err);
						callback();
					}
					else {
						callback();
					}
				})
			}
			else {
				var err = new Error("WRONG FILEJOB TYPE " + fileJob.type)
				console.error(err)
				callback();
			}
		}
		else {
			var error = new Error("FILE NO REMOTE OR LOCAL PATH");
			console.error(error);
			callback();
		}
	}
}

export default FTPController;