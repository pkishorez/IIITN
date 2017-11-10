import {NavBar} from 'classui/Navbar';
import {Promise} from 'es6-promise';
import {getResponseID} from '../../Common/Utils';
import {IRequestType, IRequest, IResponse} from '../../Server/Connection';
import {A_User, store} from '../State';
import * as io from 'socket.io-client';

let Socket: _SocketIO;
let g_reqid = 0;

class _SocketIO {
	private connected: boolean = true;
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
			store.dispatch(A_User.goOnline());
		});
		this.socket.on("disconnect", ()=>{
			// Disconnected.
			this.connected = false;
			console.log("SocketIO Connection Disconnected.");
			store.dispatch(A_User.goOffline());
		});
	}

	request(req_type: IRequestType, data?: any) {
		return new Promise<any>((resolve, reject)=>{
			if (!this.connected) {
				reject("Failed connecting to server.");
				return;
			}
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

export let Network = new _SocketIO();