class FileJob {
    constructor(localPath, rootDir) {
		this.localPath = localPath;
		this.remotePath = this.remotePath(localPath);
	}
	remotePath() {

	}
}

export default FileJob;