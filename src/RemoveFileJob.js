import FileJob from "./FileJob.js" 

class RemoveFileJob extends FileJob  {
    constructor(rootDir, workPath) {
		super(rootDir, workPath)
		this.type = "removeFile"
	}
}

export default RemoveFileJob;