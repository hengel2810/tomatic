import FTPController from "./FTPController.js"
import DirJob from "./DirJob.js"
import FileJob from "./FileJob.js"

const remote = window.require('electron').remote;
var chokidar = remote.getGlobal('chokidar');
var path = remote.getGlobal('path');

class FileWatcher {
    constructor(rootPath, host) {
		this.rootPath = rootPath;
		this.workDir = path.basename(rootPath);
		this.ftp = new FTPController(host, this.workDir);
		this.inWorkDirPath = this.inWorkDirPath.bind(this);
		this.fileAdded = this.fileAdded.bind(this);

		this.dirAdded = this.dirAdded.bind(this);
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
	inWorkDirPath(fullPath) {
		var workDirLength = this.workDir.length;
		var pathBegin = fullPath.indexOf(this.workDir) + workDirLength;
		var pathEnd = fullPath.length;
		var retVal = fullPath.substr(pathBegin, pathEnd);
		return retVal;
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
		// console.log("dirAdded");
		this.ftp.addDirJob(new DirJob(this.inWorkDirPath(eventPath)));
		// console.log("####################");
	}
	dirRemoved(eventPath) {
		// console.log("dirRemoved");
		// console.log(eventPath);
		// console.log("####################");
	}
}

export default FileWatcher;