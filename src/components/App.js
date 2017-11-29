import React from "react"
import ReactDOM from "react-dom"
import ConfigInput from "./ConfigInput.js"
import StatusView from "./StatusView.js"
import FileWatcher from "../FileWatcher.js"
import "../assets/css/App.css"

var fileWatcher;

class App extends React.Component {
  	constructor(props) {
    	super(props)
    	this.state = {
			config:undefined,
			isSync:false,
			connecting:false,
			connected:false
		}

		this.cancel = this.cancel.bind(this);
		this.start = this.start.bind(this);
		this.ftpConnect = this.ftpConnect.bind(this);
		this.synchronizing = this.synchronizing.bind(this);
		
		this.configChange = this.configChange.bind(this);
	}
	cancel() {
		fileWatcher.stopWatching();
		this.setState({
			config:undefined,
			connecting:false,
			connected:false,
			isSync:false
		})
	}
	start() {
		var config = this.state.config;
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
				connecting:false,
				connected:true
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
	configChange(config) {
		this.setState({
			config:config
		});
	}
	render() {
		var cancelButtonClass = "button cancel";
		var startButtonClass = "button start";
		var validConfig = this.state.config && this.state.config.isValid();
		var statusType = "";
		if(!validConfig) {
			cancelButtonClass = cancelButtonClass + " buttonDisabled";
			startButtonClass = startButtonClass + " buttonDisabled";
		}
		else if(validConfig && (!this.state.connecting && !this.state.connected)) {
			cancelButtonClass = cancelButtonClass + " buttonDisabled";
		}
		else if(validConfig && this.state.connecting) {
			startButtonClass = startButtonClass + " buttonDisabled";
			statusType = "sync";
		}
		else if(validConfig && this.state.connected) {
			startButtonClass = startButtonClass + " buttonDisabled";
			statusType = "info";
			if(this.state.isSync) {
				statusType = "sync";
			}
		}
		return(
			<div className="appWrapper">
				<ConfigInput configChange={this.configChange} active={true}/>
				<div className="buttonWrapper">
					<div id="cancelButton" className={cancelButtonClass} onClick={this.cancel}>Cancel</div>
					<div id="startButton" className={startButtonClass} onClick={this.start}>Start</div>
				</div>
				<StatusView status={statusType}/>
			</div>
		)
	}
}

export default App;

const appDom = document.getElementById('app')
ReactDOM.render(<App/>, appDom);
