class DirJob {
    constructor(rootDir, workPath) {
		this.remotePath = rootDir + this.inRootDirPath(rootDir, workPath);
	}
	inRootDirPath(rootDir, workPath) {
		var rootDirLength = rootDir.length;
		var pathBegin = workPath.indexOf(rootDir) + rootDirLength;
		var pathEnd = workPath.length;
		var retVal = workPath.substr(pathBegin, pathEnd);
		return retVal;
	}
}

export default DirJob;
