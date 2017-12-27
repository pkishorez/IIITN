import {User, Task, KeyValue, Guide} from 'Server/Database/IIITN';
import {getResponseID} from 'Common/Utils';
import {INR_User} from 'Common/ActionSignature';
import {ITaskAction} from 'App/State/Reducers/TaskReducer';
import { IGuideAction } from 'App/State/Reducers/GuideReducer';
import * as _ from 'lodash';
import { IUserSaveTaskDetails } from 'App/State/Reducers/UserReducer';
import { ISessionAction } from 'App/State/Reducers/SessionReducer';
import { Session } from 'Server/Database/IIITN/Session';

export type IRequestType = 
	"REGISTER" | "PROFILE" | "USER_LIST"
	| keyof(INR_User)
	| ITaskAction["type"]
	| IGuideAction["type"]
	| IUserSaveTaskDetails["type"]
	| ISessionAction["type"]

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
				return User.login(request.data, this.socket).then((data)=>{
					let {ref, ...loggedInData} = data;
					this.user = ref;
					return loggedInData;
				});
			}
			case "REGISTER": {
				return User.register(request.data);
			}
			case "PROFILE": {
				return User.getProfile(request.data.userid);
			}
			case "TASK_ACTION": {
				return Task.performAction(request.data);
			}
		}
		if (!this.user) {
			return Promise.reject("User should be authenticated first.");
		}
		switch(request.type) {
			// Authenticated actions goes here...
			case "USER_SAVE_TASK": {
				return this.user.saveTask(request.data);
			}
			case "GUIDE_ACTION": {
				if (_.get(request.data, "orderedMapAction.type")=="INIT")
					return Guide.performAction(request.data);
				break;
			}
			case "SESSION_INIT": {
				return Session.getStudents();
			}
			case "USER_LIST": {
				return User.getStudents();
			}
			case "SESSION_SITTING": {
				return Session.sit(this.user.userid, request.data.pos);
			}
		}
		// Admin actions goes here...
		if (this.user.userid!="admin") {
			return Promise.reject("User should be an admin.");
		}
		switch(request.type) {
			case "GUIDE_ACTION": {
				return Guide.performAction(request.data);
			}
			case "SESSION_ADD_STUDENTS": {
				return Session.addStudents(request.data.students);
			}
			case "SESSION_DEL_STUDENTS": {
				return Session.delStudents(request.data.students);
			}
			case "SESSION_POMPOMMMM": {
				return Session.pompomm(request.data.pos);
			}
			case "SESSION_POMPOMMMM_ALL": {
				return Session.pompommAll();
			}
		}

		return Promise.reject(`Request type ${request.type} not found.`);
	}


	initialize() {
		// Queue requests one after the other.
		let requests: IRequest[] = [];
		let processInProgress = false;
		let functionQueue = ()=>{
			if (processInProgress) {
				return;
			}
			processInProgress = true;
			if (requests.length==0) {
				processInProgress = false;
				return;
			}
			let request = requests[0];
			requests = _.drop(requests);
			this.processRequest(request).then((data: any)=>{
				let response: IResponse = {
					data
				};
				this.socket.emit(getResponseID(request.id), response);
				processInProgress = false;
				functionQueue();
			}).catch((error: any)=>{
				let response: IResponse = {
					error
				};
				this.socket.emit(getResponseID(request.id), response);
				processInProgress = false;
				functionQueue();
			});
		}
		this.socket.on('request', (request: IRequest)=>{
			// Process request and send response in data.
			requests.push(request);
			functionQueue();
		});
	}
}