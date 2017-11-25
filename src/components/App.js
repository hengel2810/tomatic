import React from "react"
import ReactDOM from "react-dom"
import Setup from "./Setup.js"
import FileItem from "./FileItem.js"
import FileWatcher from "../FileWatcher.js"
import "../assets/css/App.css"

const dialog = window.require('electron').remote.dialog
const remote = window.require('electron').remote;

var fileWatcher;

class App extends React.Component {
  	constructor(props) {
    	super(props)
    	this.state = {
			config:undefined
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.startObserving = this.startObserving.bind(this);
	}
	componentDidMount() {
		var config = {
			host:"192.168.188.35",
			path:"/Users/henrikengelbrink/Coden/pythonOpenCV"
		};
		this.startObserving(config);
	}
	startObserving(config) {
		if(config === undefined || config.host === undefined || config.path === undefined) {
			alert("Error config");
		}
		else {
			fileWatcher = new FileWatcher(config.path, config.host);
			fileWatcher.startWatching();
			this.setState({
				config:config
			})
		}
	}
	render() {
		if(this.state.config !== undefined && this.state.config.host !== undefined && this.state.config.path !== undefined) {
			// const tableItems = this.state.fileObjects.map((fileObject, index) =>
			// 	<FileItem key={index} fileObject={fileObject} config={this.state.config}/>
			// ); 
			return (
				<div className="appContent">
					<div className="header">
						<div className="info">{this.state.config.host}</div>
						<div className="info path">{this.state.config.path}</div>
					</div>
					{/* {tableItems} */}
				</div>
			)
		}
		else {
			return (
				<Setup finished={this.startObserving}/>
			)
		}
	}
}

export default App;

const appDom = document.getElementById('app')
ReactDOM.render(<App/>, appDom);
