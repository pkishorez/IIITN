import {User} from './Database/IIITN';
import {getResponseID} from '../Common/Utils';
export type IRequestType = "LOGIN" | "REGISTER"

export interface IRequest {
	id: number
	type: IRequestType
	data: any
}
export interface IResponse {
	error?: string
	data?: any
}

export class Connection {
	socket: SocketIO.Socket;
	user: User;

	constructor(socket: SocketIO.Socket) {
		this.socket = socket;
		this.initialize();
	}

	processRequest(request: IRequest) {
		switch(request.type) {
			case "LOGIN": {
				return User.login(request.data._id, request.data.password).then((user)=>{
					this.user = user;
					return "User Successfully Logged in";
				});
			}
			case "REGISTER": {
				return User.register(request.data);
			}
		}
		if (!this.user) {
			return Promise.reject("User should be authenticated first.");
		}
		switch(request.type) {
			// Authenticated actions goes here...
		}
		return Promise.reject(`Request type ${request.type} not found.`);
	}

	initialize() {
		this.socket.on('request', (request: IRequest)=>{
			// Process request and send response in data.
			this.processRequest(request).then((data)=>{
				let response: IResponse = {
					data
				};
				this.socket.emit(getResponseID(request.id), response);	
			}).catch((error)=>{
				let response: IResponse = {
					error
				};
				this.socket.emit(getResponseID(request.id), response)
			});
		});
	}
}