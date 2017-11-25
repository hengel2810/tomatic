import DirJob from "./DirJob.js"

class RemoveDirJob extends DirJob  {
    constructor(rootDir, workPath) {
		super(rootDir, workPath)
		this.type = "removeDir"
	}
}

export default RemoveDirJob;