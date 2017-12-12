import {NavBar} from 'classui/Navbar';
import {Feedback} from 'classui/Components/Feedback';
import {Promise} from 'es6-promise';
import {getResponseID} from 'Common/Utils';
import {IRequestType, IRequest, IResponse} from 'Server/Connection';
import {__store, GetState} from 'App/State';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { Me } from 'App/MyActions';

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
			Me.goOnline();
			// Attempt login here :)
			if (GetState().user.userid) {
				// Reestablish session if user is already logged in.
				Me.login({
					userid: GetState().user.userid as string,
					secretKey: GetState().user.secretKey as string
				});	
			}
		});
		this.socket.on("disconnect", ()=>{
			// Disconnected.
			this.connected = false;
			console.log("SocketIO Connection Disconnected.");
			Me.goOffline();
		});
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
			return Promise.reject("Server Error: "+JSON.stringify(error));
		});
	}
	requestAndDispatch(req_type: IRequestType, data: any) {
		console.log("REQUEST : ", req_type, data);
		return this.request(req_type, data).then((response: any)=>{
			console.log("RESPONSE :): ", response);

			if (typeof response == "object") {
				__store.dispatch({
					type: req_type,
					...data,
					...response
				});
			}
			else {
				__store.dispatch({
					type: req_type,
					...data
				});
			}
			return response;
		}).catch((error)=>{
			Feedback.show(error, "error");
			return Promise.reject(error);
		})
	}
}

export let Network = new _SocketIO();