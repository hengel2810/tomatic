"use strict";

const UdpNode = require('udp-node')

class udpController {
    constructor() {
		this.udpNode = new UdpNode();
		// this.udpNode.set({
		// 	name:"electron",
		// 	type:"electronApp"
		// });
		// this.udpNode.onNode((message, rinfo) => {
		// 	console.log("onNode");
		// 	console.log(message);
		// 	console.log(rinfo);
		// });
		this.udpNode.broadcast();
		console.log("UDP INIT");
    }
}

export default udpController;