import {NavBar} from 'classui/Navbar';
import {Promise} from 'es6-promise';
import {getResponseID} from '../Common/Utils';
import {IRequestType, IRequest, IResponse} from '../Server/Connection';
import * as io from 'socket.io-client';

let Socket: _SocketIO;
let g_reqid = 0;

class _SocketIO {
	private socket: SocketIOClient.Socket;
	constructor() {
		this.socket = io();
		this.socket.on("connect", ()=>{
			// Connected.
			console.log("SocketIO Connection established.");
		});
		this.socket.on("disconnect", ()=>{
			// Disconnected.
			console.log("SocketIO Connection Disconnected.");
		});
	}

	request(req_type: IRequestType, data: any) {
		return new Promise((resolve, reject)=>{
			let reqid = g_reqid++;
			let request: IRequest = {
				id: reqid,
				type: req_type,
				data
			};
			console.log("Request", request);
			this.socket.emit("request", request);
			let responseID = getResponseID(reqid);
			this.socket.on(responseID, (json: IResponse)=>{
				if (json.error) {
					reject(json.error);
				}
				else {
					resolve(json.data);
				}
				this.socket.off(responseID);
			});
		});
	}
}

export let SocketIO = new _SocketIO();