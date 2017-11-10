import {User, Database} from './Database/IIITN';
import {getResponseID} from '../Common/Utils';
import {INR_Task, INR_User} from '../Common/ActionSignature';
export type IRequestType = "REGISTER" | "STUDENTS" | "PROFILE" | keyof(INR_Task) | keyof(INR_User) | "TASK_GET"

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
			case "USER_LOGIN": {
				return User.login(request.data).then((data)=>{
					this.user = data.ref;
					return {secretKey: data.secretKey};
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
				return Database.addTask(request.data);
			}
			case "TASK_MODIFY": {
				return Database.modifyTask(request.data);
			}
			case "TASK_GET": {
				return this.user.getTasks();
			}
			case "USER_TASK_SAVE": {
				return this.user.saveTask(request.data);
			}
		}
		return Promise.reject(`Request type ${request.type} not found.`);
	}

	initialize() {
		this.socket.on('request', (request: IRequest)=>{
			// Process request and send response in data.
			this.processRequest(request).then((data: any)=>{
				let response: IResponse = {
					data
				};
				this.socket.emit(getResponseID(request.id), response);	
			}).catch((error: any)=>{
				let response: IResponse = {
					error
				};
				this.socket.emit(getResponseID(request.id), response)
			});
		});
	}
}