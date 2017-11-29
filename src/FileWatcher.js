import FTPController from "./FTPController.js"
import PutDirJob from "./models/PutDirJob.js"
import RemoveDirJob from "./models/RemoveDirJob.js"
import PutFileJob from "./models/PutFileJob.js"
import RemoveFileJob from "./models/RemoveFileJob.js"
import { config } from "bluebird-lst";

const remote = window.require('electron').remote;
const chokidar = remote.getGlobal('chokidar');
const path = remote.getGlobal('path');

class FileWatcher {
    constructor(config, ftpConnect) {

		this.rootPath = config.path;
		this.rootDir = path.basename(config.path);
		var ftpConfig = {
			host:config.host,
			user:config.user,
			password:config.password,
			synchronizing:config.synchronizing
		}
		this.ftp = new FTPController(ftpConfig, this.rootDir, ftpConnect);
		
		this.fileAdded = this.fileAdded.bind(this);
		this.fileChanged = this.fileChanged.bind(this);
		this.fileRemoved = this.fileRemoved.bind(this);
		this.dirAdded = this.dirAdded.bind(this);
		this.dirRemoved = this.dirRemoved.bind(this);
		this.stopWatching = this.stopWatching.bind(this);
	}
	startWatching() {
		this.ftp.start();
		this.fileWatcher = chokidar.watch(this.rootPath, {
			ignored: /(^|[\/\\])\../,
			persistent: true
		});
		this.fileWatcher.on('error', this.watchError);
		this.fileWatcher.on('add', this.fileAdded);
		this.fileWatcher.on('change', this.fileChanged);
		this.fileWatcher.on('unlink', this.fileRemoved);
		this.fileWatcher.on('addDir', this.dirAdded);
		this.fileWatcher.on('unlinkDir', this.dirRemoved);
	}
	stopWatching() {
		// console.log("##### stopWatching #####");
		this.ftp.stop();
		this.fileWatcher.close();
	}
	watchError(err) {
		console.error(err);
	}
	fileAdded(eventPath) {
		// console.log("fileAdded" + eventPath);
		var fileJob = new PutFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	fileChanged(eventPath) {
		// console.log("fileChanged" + eventPath);
		var fileJob = new PutFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	fileRemoved(eventPath) {
		// console.log("fileRemoved" + eventPath);
		var fileJob = new RemoveFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	dirAdded(eventPath) {
		// console.log("dirAdded" + eventPath);
		var dirJob = new PutDirJob(this.rootDir, eventPath);
		this.ftp.addPutDirJob(dirJob);
	}
	dirRemoved(eventPath) {
		// console.log("dirRemoved" + eventPath);
		var dirJob = new RemoveDirJob(this.rootDir, eventPath);
		this.ftp.addRemoveDirJob(dirJob);
	}
}

export default FileWatcher;