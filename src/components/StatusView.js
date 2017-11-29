import React from "react"
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

import "../assets/css/StatusView.css"

import refreshIcon from '../assets/media/reload.png';
import checkIcon from '../assets/media/tick.png';

const remote = window.require('electron').remote;
const moment = remote.getGlobal('moment');

class StatusView extends React.Component {
  	constructor(props) {
    	super(props)

		
	}
	render() {
		var icon;
		var text = "";
		var iconClasses = "";
		if(this.props.status === "sync") {
			icon = refreshIcon;
			text = "Synchronizing...";
			iconClasses = "icon rotating";
		}
		else if(this.props.status === "info") {
			icon = checkIcon;
			text = moment().format('DD.MM.YYYY, hh:mm:ss');
			iconClasses = "icon";
		}
		else {
			return(<div></div>);
		}
		return(
			<div className="statusCanvas">
				<img className={iconClasses} src={icon}/>
				<div className="text">{text}</div>
			</div>
		)
	}
}

StatusView.propTypes = {
	status: PropTypes.string.isRequired
}

export default StatusView;