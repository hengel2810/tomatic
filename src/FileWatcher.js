import FTPController from "./FTPController.js"
import PutDirJob from "./PutDirJob.js"
import RemoveDirJob from "./RemoveDirJob.js"
import PutFileJob from "./PutFileJob.js"
import RemoveFileJob from "./RemoveFileJob.js"

const remote = window.require('electron').remote;
var chokidar = remote.getGlobal('chokidar');
var path = remote.getGlobal('path');

class FileWatcher {
    constructor(rootPath, host) {
		this.rootPath = rootPath;
		this.rootDir = path.basename(rootPath);
		this.ftp = new FTPController(host, this.rootDir);
		
		this.fileAdded = this.fileAdded.bind(this);
		this.fileChanged = this.fileChanged.bind(this);
		this.fileRemoved = this.fileRemoved.bind(this);
		this.dirAdded = this.dirAdded.bind(this);
		this.dirRemoved = this.dirRemoved.bind(this);
	}
	startWatching() {
		this.fileWatcher = chokidar.watch(this.rootPath, {
			ignored: /(^|[\/\\])\../,
			persistent: true
		});
		this.fileWatcher.on('add', this.fileAdded);
		this.fileWatcher.on('change', this.fileChanged);
		this.fileWatcher.on('unlink', this.fileRemoved);
		this.fileWatcher.on('addDir', this.dirAdded);
		this.fileWatcher.on('unlinkDir', this.dirRemoved);
	}
	fileAdded(eventPath) {
		var fileJob = new PutFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	fileChanged(eventPath) {
		var fileJob = new PutFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	fileRemoved(eventPath) {
		var fileJob = new RemoveFileJob(eventPath, this.rootDir);
		this.ftp.addFileJob(fileJob);
	}
	dirAdded(eventPath) {
		// console.log("ADD DIR" + eventPath);
		var dirJob = new PutDirJob(this.rootDir, eventPath);
		this.ftp.addPutDirJob(dirJob);
	}
	dirRemoved(eventPath) {
		// console.log("RM DIR" + eventPath);
		var dirJob = new RemoveDirJob(this.rootDir, eventPath);
		this.ftp.addRemoveDirJob(dirJob);
	}
}

export default FileWatcher;