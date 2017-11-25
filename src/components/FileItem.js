import React from "react"
import ReactDOM from "react-dom"
import "../assets/css/FileItem.css"

const remote = window.require('electron').remote;
var path = remote.getGlobal('path');
var moment = remote.getGlobal('moment');
var ftpClient = remote.getGlobal('ftpClient');

import addIcon from '../assets/media/plus.png';
import refreshIcon from '../assets/media/reload.png';
import deleteIcon from '../assets/media/garbage.png';

class FileItem extends React.Component {
  	constructor(props) {
		super(props)
    	this.state = {
			status:"pending"
		};
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	componentDidMount() {
		this.uploadItem();
	}
	uploadItem() {
		// var destPath = "/" + this.props.config.mainDir + this.props.fileObject.subPath + "/" + this.props.fileObject.fileName;
		// // var destPath = "/" + this.props.fileObject.fileName;		
		// var srcPath = this.props.fileObject.fullPath;
		// var that = this;
		// console.log(that.props.fileObject.fileName);
		// console.log(that.props.fileObject.subPath);
		// console.log(destPath);
		// console.log("############################");
		// var c = new ftpClient();
		// c.on('ready', function() {
		// 	c.mkdir("/" + that.props.config.mainDir, true, function(err) {
		// 		if(err) {
		// 			console.log(err);
		// 			c.end();
		// 		}
		// 		else {
		// 			if(that.props.fileObject.subPath && that.props.fileObject.subPath.length > 0) {
		// 				c.mkdir("/" + this.props.config.mainDir + that.props.fileObject.subPath, true, function(err) {
		// 					if(err) {
		// 						console.log(err);
		// 						// throw err;
		// 						c.end();
		// 					}
		// 					else {
		// 						c.append(srcPath, destPath, function(err) {
		// 							if (err) throw err;
		// 							c.end();
		// 						});
		// 					}
		// 				});
		// 			}
		// 			else {
		// 				c.append(srcPath, destPath, function(err) {
		// 					if (err) throw err;
		// 					c.end();
		// 				});
		// 			}
		// 		}
		// 	});
		// });
		// c.connect({
		//   	host:this.props.config.ip,
		//   	user:"upload",
		//   	password:"wilano1337@"
		// });

		// var config = {
		//     host: this.props.config.ip,
		//     port: 21,
		//     user: 'upload',
		//     password: 'wilano1337@'
		// }
		// var options = {
		//     logging: 'basic'
		// }
		// var client = new ftpClient(config, options);
		// var destPath = "/";// + this.props.config.mainDir + this.props.fileObject.subPath;
		// var srcPath = "index.html";//this.props.fileObject.fullPath;
		// console.log(destPath);
		// console.log(srcPath);
		// console.log("#######################");
		// client.connect(function () {
		//   	client.upload([srcPath], destPath, {
		//     	overwrite: 'older'
		//   	}, function (result) {
		//     	console.log(result);
		//   	});
		// });
	}
	render() {
		var strTime = moment().format('hh:mm:ss');  
		var iconClass = "icon "  + this.state.status;
		return (
			<div className="fileItemWrapper">
				<div className="content">
					<div className="file">{this.props.fileObject.subPathFile}</div>
					<div className="uploadStatus">
						{/* <div className={iconClass}></div> */}
						<div className="timestamp">{strTime}</div>
					</div>
				</div>
			</div>
		)
	}
}

export default FileItem;