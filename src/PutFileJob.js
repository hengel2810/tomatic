import FileJob from "./FileJob.js" 

class PutFileJob extends FileJob  {
    constructor(rootDir, workPath) {
		super(rootDir, workPath)
		this.type = "putFile"
	}
}

export default PutFileJob;