import FTPController from "./FTPController.js"
import PutDirJob from "./PutDirJob.js"
import RemoveDirJob from "./RemoveDirJob.js"
import FileJob from "./FileJob.js"

const remote = window.require('electron').remote;
var chokidar = remote.getGlobal('chokidar');
var path = remote.getGlobal('path');

class FileWatcher {
    constructor(rootPath, host) {
		this.rootPath = rootPath;
		this.workDir = path.basename(rootPath);
		this.ftp = new FTPController(host, this.workDir);
		
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
		// console.log("fileAdded");
		// this.ftp.addFileJob(new FileJob(eventPath));
		// console.log("####################");
	}
	fileChanged(eventPath) {
		// console.log("fileChanged");
		// console.log(eventPath);
		// console.log("####################");
	}
	fileRemoved(eventPath) {
		// console.log("fileRemoved");
		// console.log(eventPath);
		// console.log("####################");
	}
	dirAdded(eventPath) {
		// console.log("ADD DIR" + eventPath);
		var dirJob = new PutDirJob(this.workDir, eventPath);
		this.ftp.addDirJob(dirJob);
	}
	dirRemoved(eventPath) {
		// console.log("RM DIR" + eventPath);
		var dirJob = new RemoveDirJob(this.workDir, eventPath);
		this.ftp.addDirJob(dirJob);
	}
}

export default FileWatcher;