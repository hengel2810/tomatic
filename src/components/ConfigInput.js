import React from "react"
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

import ConfigObject from "../models/ConfigObject.js"
import "../assets/css/ConfigInput.css"

const dialog = window.require('electron').remote.dialog

class ConfigInput extends React.Component {
  	constructor(props) {
    	super(props)

		this.pathInputValue = "";
		this.hostInputValue = "";
		this.userInputValue = "";
		this.passwordInputValue = "";

		// Local Dev Settings
		// this.pathInputValue = "/Users/henrikengelbrink/Coden/pythonOpenCV";
		// this.hostInputValue = "192.168.188.35";
		// this.userInputValue = "upload";
		// this.passwordInputValue = "wilano1337@";

		this.inputChanged = this.inputChanged.bind(this);
		this.selectPath = this.selectPath.bind(this);
	}
	configFromInput() {
		var path = document.getElementById("pathInput").value;
		var host = document.getElementById("hostInput").value;
		var user = document.getElementById("userInput").value;
		var password = document.getElementById("passwordInput").value;
		var config = new ConfigObject(path, host, user, password);
		return config;
	}
	inputChanged() {
		var config = this.configFromInput();
		this.pathInputValue = config.path;
		this.hostInputValue = config.host;
		this.userInputValue = config.user;
		this.passwordInputValue = config.password;
		this.props.configChange(config);
	}
	selectPath() {
		var options = {
      	  properties:[
		    "openDirectory"
		  ]
		};
		var that = this;
		dialog.showOpenDialog(options, function (filePath) { 
			if(filePath === undefined) { 
				console.log("No file selected"); 
			} 
			else {
				document.getElementById("pathInput").value = filePath;
			}
		});
	}
	render() {
		return(
			<div className="configInput">
				<input disabled={!this.props.active} defaultValue={this.pathInputValue} id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
				<input disabled={!this.props.active} defaultValue={this.hostInputValue} id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
				<input disabled={!this.props.active} defaultValue={this.userInputValue} id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
				<input disabled={!this.props.active} defaultValue={this.passwordInputValue} id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
			</div>
		)
	}
}

ConfigInput.propTypes = {
	configChange: PropTypes.func.isRequired,
	active: PropTypes.bool.isRequired
}

export default ConfigInput;