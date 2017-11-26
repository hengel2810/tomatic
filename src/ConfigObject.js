class ConfigObject {
    constructor(path, host, user, password) {
		this.path = path;
		this.host = host;
		this.user = user;
		this.password = password;

		this.validPath = this.validPath.bind(this);
		this.validHost = this.validHost.bind(this);
		this.validUser = this.validUser.bind(this);
		this.validPassword = this.validPassword.bind(this);
		this.isValid = this.isValid.bind(this);
	}
	validPath() {
		if(this.path === undefined || this.path.length === 0 ) {
			return false;
		}
		return true;
	}
	validHost() {
		if(this.host === undefined || this.host.length < 5 ) {
			return false;
		}
		return true;
	}
	validUser() {
		if(this.user === undefined || this.user.length < 5 ) {
			return false;
		}
		return true;
	}
	validPassword() {
		if(this.password === undefined || this.password.length < 5 ) {
			return false;
		}
		return true;
	}
	isValid() {
		return this.validPath() && this.validHost() && this.validUser() && this.validPassword();		
	}
}

export default ConfigObject;