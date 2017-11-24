import React from "react"
import ReactDOM from "react-dom"
import Setup from "./Setup.js"
import "../assets/css/App.css"

const dialog = window.require('electron').remote.dialog
const remote = window.require('electron').remote;
var chokidar = remote.getGlobal('chokidar');

class App extends React.Component {
  	constructor(props) {
    	super(props)
    	this.state = {
      		config: null
		}
		this.startObserving = this.startObserving.bind(this);
  	}
	startObserving(config) {
		console.log(config);
		if(config === undefined || config.ip === undefined || config.path === undefined) {
			alert("Error config");
		}
		else {
			chokidar.watch(config.path, {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
				console.log(event, path);
			});
			this.setState({
				config:config
			})
		}
	}
	render() {
		if(this.state.config == null) {
			return (
				<Setup finished={this.startObserving}/>
			)
		}
		else {
			return (
				<div className="appDiv">
					<div className="appHeader">
					
					</div>
				</div>
			)
		}
	}
}

export default App;

const appDom = document.getElementById('app')
ReactDOM.render(<App/>, appDom);
