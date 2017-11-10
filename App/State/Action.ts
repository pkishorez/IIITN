import {IUserAction} from './Reducers/UserReducer';
import {ITaskAction, ITaskState, ITask} from './Reducers/TaskReducer';

export let A_User = {
	// NETWORK requests goes here.
	login(data: {userid: string,secretKey: string}): IUserAction {
		return {
			type: "USER_LOGIN",
			...data
		};
	},

	// Local Requests goes here.
	logout(): IUserAction {
		return {
			type: "USER_LOGOUT"
		};
	},
	goOnline(): IUserAction {
		return {
			type: "USER_ONLINE"
		}
	},
	goOffline(): IUserAction {
		return {
			type: "USER_OFFLINE"
		}
	}
}

export let A_Task = {

	// NETWORK REQUESTS GOES HERE.
	init(tasks: ITaskState): ITaskAction {
		return {
			type: "TASK_INIT",
			tasks
		};
	},
	add(data: {id: string,task: ITask}): ITaskAction {
		return {
			type: "TASK_ADD",
			...data
		}
	},
	save(data: {id: string, code: string}): ITaskAction {
		return {
			type: "TASK_SAVE",
			...data
		};
	},

	// Local requests.
	saveBuffer(data: {id: string, code: string}): ITaskAction {
		return {
			type: "TASK_SAVE_BUFFER",
			...data
		}
	}
}