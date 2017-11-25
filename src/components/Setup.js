import React from "react"
import ReactDOM from "react-dom"
import "../assets/css/Setup.css"
import folderIcon from '../assets/media/folder.png';

const dialog = window.require('electron').remote.dialog

class Setup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ip:undefined,
			path:undefined
		}
		this.setIP = this.setIP.bind(this);
		this.selectPath = this.selectPath.bind(this);
		this.finishSetup = this.finishSetup.bind(this);
	}
	setIP() {
		var ip = document.getElementById("ipInput").value;
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {  
			this.setState({
				ip:ip
			});
		} 
		else {
			alert("Please enter valid ip address");
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
				that.setState({
					path:filePath
				})
			} 
		});
	}
	finishSetup() {
		var config = {
			ip:this.state.ip,
			path:this.state.path
		};
		if(this.props.finished) {
			this.props.finished(config);
		}
	}
  	render() {
		if(this.state.ip === undefined && this.state.path === undefined) {
			return (
				<div className="setupDiv">
					<div className="setupContentDiv">
						<div className="ipInputWrapper"><input id="ipInput" className="inputField ipInput" type="text" placeholder="FTP address (IPv4)" name="folder" defaultValue="192.168.178.22"/></div>
						<div className="button submitButton" onClick={this.setIP}>OK</div>
					</div>
				</div>
			)
		}
		else if(this.state.ip.length > 0 && this.state.path === undefined) {
			return (
				<div className="setupDiv">
					<div className="setupContentDiv">
						<img className="selectFolderIcon" src={folderIcon} onClick={this.selectPath}/>
					</div>
				</div>
			)
		}
		else {
			return (
				<div className="setupDiv">
					<div className="setupContentDiv">
						<div className="setupInfoValue">{this.state.ip}</div>
						<div className="setupInfoValue">{this.state.path}</div>
						<div className="button submitButton" onClick={this.finishSetup}>OK</div>
					</div>
				</div>
			)
		}
  	}
}

export default Setup;