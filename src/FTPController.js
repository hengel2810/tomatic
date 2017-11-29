const remote = window.require('electron').remote;
const ftpClient = remote.getGlobal('ftpClient');
const async = remote.getGlobal('async');

class FTPController {
    constructor(config, rootDir, ftpConnect) {
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
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
		
		this.config = config;
		this.synchronizing = config.synchronizing;
		this.rootDir = "/" + rootDir;
		this.client = new ftpClient();
		this.active = false;
		this.isSyncing = false;
		this.ftpConnect = ftpConnect;
		this.failedJobs = [];
		this.succeededJobs = [];
		
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
			if(this.active) {
				if(that.ftpConnect) {
					that.ftpConnect(err);
				}
				console.error(err);
			}
		});
	}
	start() {
		this.active = true;
		this.client.connect({
			host:this.config.host,
			port: 21,
			user:this.config.user,
			password:this.config.password
		});
	}
	stop() {
		this.active = false;
		this.client.destroy();
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
				that.startSync();
			}
		})
	}
	setSync() {
		var putDirQueueCount = this.putDirQueue.length();
		var fileQueueCount = this.fileQueue.length()
		var removeDirQueueCount = this.removeDirQueue.length();
		// console.log(putDirQueueCount + " - " + fileQueueCount + " - " + removeDirQueueCount);
		if(putDirQueueCount === 0 && fileQueueCount === 0 && removeDirQueueCount === 0) {
			if(this.isSyncing === true) {
				var syncResult = {
					fail:this.failedJobs,
					success:this.succeededJobs
				}
				this.failedJobs = [];
				this.succeededJobs = [];
				this.synchronizing(false, syncResult);
			}
			this.isSyncing = false;
		}
		else {
			if(this.isSyncing === false) {
				this.synchronizing(true, undefined);
			}
			this.isSyncing = true;
		}
	}
	startSync() {
		var putDirQueueCount = this.putDirQueue.length();
		var fileQueueCount = this.fileQueue.length()
		var removeDirQueueCount = this.removeDirQueue.length();
		// console.log(putDirQueueCount + " - " + fileQueueCount + " - " + removeDirQueueCount);
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
		this.startSync();
	}
	addRemoveDirJob(removeDirJob) {
		this.removeDirQueue.push(removeDirJob, function(err) {
			if(err) {
				console.error(err);
			}
			else {
				// console.log('DIR REMOVED ' + removeDirJob.remotePath);
			}
		});
		this.startSync();
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
		this.startSync();
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
		var that = this;
		this.isSyncing = true;
		this.client.mkdir(dirJob.remotePath,true,function(err) {
			if(err) {
				if(dirJob.failCount < 3) {
					dirjob.failCount++;
					that.addPutDirJob(dirJob);
				}
				else {
					that.failedJobs.push(dirJob);
				}
				console.error(err);
				callback()
			}
			else {
				that.succeededJobs.push(dirJob);
				callback()
			}
		})
	}
	handleRemoveDirJob(dirJob, callback) {
		var that = this;
		this.isSyncing = true;
		this.client.rmdir(dirJob.remotePath, true, function(err) {
			if(err) {
				if(dirJob.failCount < 3) {
					dirjob.failCount++;
					that.addRemoveDirJob(dirJob);
				}
				else {
					that.failedJobs.push(dirJob);
				}
				console.error(err);
				callback()
			}
			else {
				that.succeededJobs.push(dirJob);
				callback()
			}
		})
	}
	handleFileJob(fileJob, callback) {
		var that = this;
		this.isSyncing = true;
		if(fileJob.remotePath && fileJob.localPath) {
			if(fileJob.type ===  "putFile") {
				this.client.put(fileJob.localPath, fileJob.remotePath, function(err) {
					if(err) {
						if(fileJob.failCount < 3) {
							fileJob.failCount++;
							that.addFileJob(fileJob);
						}
						else {
							that.failedJobs.push(fileJob);
						}
						console.error(err);
						callback();
					}
					else {
						that.succeededJobs.push(fileJob);
						callback();
					}
				})
			}
			else if(fileJob.type ===  "removeFile") {
				this.client.delete(fileJob.remotePath, function(err) {
					if(err) {
						if(fileJob.failCount < 3) {
							fileJob.failCount++;
							that.addFileJob(fileJob);
						}
						else {
							that.failedJobs.push(fileJob);
						}
						console.error(err);
						callback();
					}
					else {
						that.succeededJobs.push(fileJob);
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