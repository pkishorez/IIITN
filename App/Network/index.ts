import {Promise} from 'es6-promise';
import {getResponseID} from 'Common/Utils';
import {IRequestType, IRequest, IResponse} from 'Server/Connection';
import * as io from 'socket.io-client';

let Socket: _SocketIO;
let g_reqid = 0;

class _SocketIO {
	private connected: boolean = false;
	public get onlineStatus(): boolean {
		return this.connected;
	}
	private socket: SocketIOClient.Socket;
	constructor() {
		this.socket = io();
		this.socket.on("connect", ()=>{
			// Connected.
			this.connected = true;
			console.log("SocketIO Connection established.");
		});
		this.socket.on("disconnect", ()=>{
			// Disconnected.
			this.connected = false;
			console.log("SocketIO Connection Disconnected.");
		});
	}

	// Restrain using these functions max :)
	_on(type: string, func: (data: any)=>void) {
		this.socket.on(type, func);
	}
	_off(type: string, func: (data: any)=>void) {
		this.socket.off(type, func);
	}
	registerConnected(func: ()=>void) {
		this.socket.on("connect", func);
	}
	registerDisconnected(func: ()=>void) {
		this.socket.on("disconnect", func);
	}
	request(req_type: IRequestType, data?: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.connected) {
				return reject("Failed connecting to server.");
			}
			let reqid = g_reqid++;
			let request: IRequest = {
				id: reqid,
				type: req_type,
				data
			};
			this.socket.emit("request", request);
			let responseID = getResponseID(reqid);
			this.socket.on(responseID, (json: IResponse)=>{
				this.socket.off(responseID);
				if (json.error) {
					return reject(json.error);
				}
				else {
					return resolve(json.data);
				}
			});
		}).catch((error)=>{
			console.error(error);
			return Promise.reject(typeof error=="string"?error:JSON.stringify(error));
		});
	}
}

export let Network = new _SocketIO();