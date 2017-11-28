import React from "react"
import ReactDOM from "react-dom"
import FileWatcher from "../FileWatcher.js"
import ConfigObject from "../models/ConfigObject.js"
import "../assets/css/App.css"

import refreshIcon from '../assets/media/reload.png';
import checkIcon from '../assets/media/tick.png';

const dialog = window.require('electron').remote.dialog
const remote = window.require('electron').remote;
const moment = remote.getGlobal('moment');

var fileWatcher;

class App extends React.Component {
  	constructor(props) {
    	super(props)
    	this.state = {
			config:undefined,
			isSync:false,
			inputReady:false,
			connecting:false
		}
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
		this.cancel = this.cancel.bind(this);
		this.start = this.start.bind(this);
		this.ftpConnect = this.ftpConnect.bind(this);
		this.synchronizing = this.synchronizing.bind(this);
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
		if(config.isValid()) {
			if(!this.state.inputReady) {
				this.setState({
					inputReady:true
				})
			}
		}
		else {
			if(this.state.inputReady) {
				this.setState({
					inputReady:false
				})
			}
		}
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
	cancel() {
		fileWatcher.stopWatching();
		this.setState({
			config:undefined
		})
	}
	start() {
		var config = this.configFromInput();
		config.synchronizing = this.synchronizing;
		if(config.isValid()) {
			fileWatcher = new FileWatcher(config, this.ftpConnect);
			fileWatcher.startWatching();
			this.setState({
				config:config,
				connecting:true
			})
		}
		else {
			alert("Ooops ! Problem starting the service. Please check your input data.");
		}
	}
	ftpConnect(err) {
		if(err) {
			console.error(err);
			alert("There was an error connecting to the server. Perhaps the user or the password is wrong.");
			this.setState({
				config:undefined,
				connecting:false
			})
		}
		else {
			this.setState({
				connecting:false
			})
		} 	
		
	}
	synchronizing(isSync, results) {
		if(isSync === false) {
			var failCount = 0;
			var successCount = 0;
			if(results && results.fail) {
				failCount = results.fail.length;
			}
			if(results && results.success) {
				successCount = results.success.length;
			}
			let syncNotification = new Notification("Synchronized", {
				body: "Finished synchronizing with the ftp server\nSuccess: " + successCount + "\nFail: " + failCount 
			})
		}
		this.setState({
			isSync:isSync
		})
	}
	render() {
		if(this.state.config && this.state.config.isValid() && !this.state.connecting) {
			var icon;
			var text = "";
			var iconClasses = "";
			if(this.state.isSync) {
				icon = refreshIcon;
				text = "Synchronizing...";
				iconClasses = "icon rotating";
			}
			else if(!this.state.isSync) {
				icon = checkIcon;
				text = moment().format('DD.MM.YYYY, hh:mm:ss');
				iconClasses = "icon";
			}
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input disabled defaultValue={this.state.config.path} id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged}/>
						<input disabled defaultValue={this.state.config.host} className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input disabled defaultValue={this.state.config.user} id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input disabled defaultValue={this.state.config.password} id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
						<div id="cancelButton" className="button cancel" onClick={this.cancel}>Cancel</div>
						<div id="startButton" className="button start startDisabled" onClick={this.start}>Start</div>
						<div className="statusCanvas">
							<div className="wrapper">
								<img className={iconClasses} src={icon}/>
								<div className="text">{text}</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else if(this.state.config && this.state.config.isValid() && this.state.connecting) {
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input defaultValue={this.state.config.path} id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
						<input defaultValue={this.state.config.host} id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.state.config.user} id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.state.config.password} id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
						<div id="cancelButton" className="button cancel" onClick={this.cancel}>Cancel</div>
						<div id="startButton" className="button start startDisabled" onClick={this.start}>Start</div>
						<div className="statusCanvas">
							<div className="wrapper">
							<img className="icon rotating" src={refreshIcon}/>
							<div className="text">Connecting...</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		else  if(this.state.inputReady) {
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input defaultValue={this.pathInputValue} id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
						<input defaultValue={this.hostInputValue} id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.userInputValue} id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.passwordInputValue} id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
						<div id="cancelButton" className="button cancel cancelDisabled" onClick={this.cancel}>Cancel</div>
						<div id="startButton" className="button start" onClick={this.start}>Start</div>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input defaultValue={this.pathInputValue} id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
						<input defaultValue={this.hostInputValue} id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.userInputValue} id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input defaultValue={this.passwordInputValue} id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
						<div id="cancelButton" className="button cancel cancelDisabled" onClick={this.cancel}>Cancel</div>
						<div id="startButton" className="button start startDisabled" onClick={this.start}>Start</div>
					</div>
				</div>
			)
		}
	}
}

export default App;

const appDom = document.getElementById('app')
ReactDOM.render(<App/>, appDom);
