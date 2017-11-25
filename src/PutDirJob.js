import DirJob from "./DirJob.js" 

class PutDirJob extends DirJob  {
    constructor(rootDir, workPath) {
		super(rootDir, workPath)
		this.type = "putDir"
	}
}

export default PutDirJob;
