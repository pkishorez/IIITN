import {User, Database} from './Database/IIITN';
import {getResponseID} from '../Common/Utils';
export type IRequestType = "LOGIN" | "REGISTER" | "STUDENTS" | "PROFILE" | "TASK_ADD" | "TASK_GET" | "TASK_SAVE"

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
			case "STUDENTS": {
				return Database.getStudents();
			}
			case "PROFILE": {
				return Database.getProfile(request.data.userid);
			}
		}
		if (!this.user) {
			return Promise.reject("User should be authenticated first.");
		}
		switch(request.type) {
			// Authenticated actions goes here...
			case "TASK_ADD": {
				return this.user.addTask(request.data);
			}
			case "TASK_GET": {
				return this.user.getTasks();
			}
			case "TASK_SAVE": {
				return this.user.saveTask(request.data.id, request.data.code);
			}
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