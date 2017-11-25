class FileJob {
    constructor(localPath, rootDir) {
		this.localPath = localPath;
		this.remotePath = this.remotePath(localPath, rootDir);
	}
	remotePath(localPath, rootDir) {
		var pathBegin = localPath.indexOf(rootDir);
		var pathEnd = localPath.length;
		var retVal = localPath.substr(pathBegin, pathEnd);
		return retVal;
	}
}

export default FileJob;