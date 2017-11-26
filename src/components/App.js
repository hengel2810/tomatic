import React from "react"
import ReactDOM from "react-dom"
import FileWatcher from "../FileWatcher.js"
import ConfigObject from "../ConfigObject.js"
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
			inputReady:false
		}
		this.inputChanged = this.inputChanged.bind(this);
		this.selectPath = this.selectPath.bind(this);
		this.cancel = this.cancel.bind(this);
		this.start = this.start.bind(this);
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
		if(this.configFromInput().isValid()) {
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
			fileWatcher = new FileWatcher(config);
			fileWatcher.startWatching();
			this.setState({
				config:config
			})
		}
		else {
			alert("Error config");
		}
	}
	synchronizing(isSync) {
		this.setState({
			isSync:isSync
		})
	}
	render() {
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

		if(this.state.config && this.state.config.isValid()) {
			console.log("running");
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input disabled defaultValue="/Users/henrikengelbrink/Coden/pythonOpenCV" id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged}/>
						<input disabled defaultValue="192.168.188.35" id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input disabled defaultValue="upload" id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input disabled defaultValue="wilano1337@" id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
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
		else  if(this.state.inputReady) {
			console.log("inputReady");
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input defaultValue="/Users/henrikengelbrink/Coden/pythonOpenCV" id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
						<input defaultValue="192.168.188.35" id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input defaultValue="upload" id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input defaultValue="wilano1337@" id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
						<div id="cancelButton" className="button cancel cancelDisabled" onClick={this.cancel}>Cancel</div>
						<div id="startButton" className="button start" onClick={this.start}>Start</div>
					</div>
				</div>
			)
		}
		else {
			console.log("start");
			return (
				<div className="appWrapper">
					<div className="appContent">
						<input defaultValue="/Users/henrikengelbrink/Coden/pythonOpenCV" id="pathInput" className="inputField pathField" type="text" placeholder="path" name="path" onChange={this.inputChanged} onClick={this.selectPath}/>
						<input defaultValue="192.168.188.35" id="hostInput" className="inputField hostField" type="text" placeholder="ftp host" name="folder"onChange={this.inputChanged} />
						<input defaultValue="upload" id="userInput" className="inputField userField" type="text" placeholder="user" name="folder"onChange={this.inputChanged} />
						<input defaultValue="wilano1337@" id="passwordInput" className="inputField passwordField" type="password" placeholder="password" name="folder"onChange={this.inputChanged} />
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
