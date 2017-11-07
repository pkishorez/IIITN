import {IUserAction} from './UserReducer';
import {ITaskAction, ITaskState, ITask} from './TaskReducer';

export let A_User = {
	login(userid: string): IUserAction {
		return {
			type: "USER_LOGIN",
			userid
		};
	},
	logout(): IUserAction {
		return {
			type: "USER_LOGIN",
			userid: null
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
	init(tasks: ITaskState): ITaskAction {
		return {
			type: "TASK_INIT",
			tasks
		};
	},
	add(id: string, task: ITask): ITaskAction {
		return {
			type: "TASK_ADD",
			id,
			task
		}
	},
	saveBuffer(id: string, code: string): ITaskAction {
		return {
			type: "TASK_SAVE_BUFFER",
			id,
			code
		}
	},
	save(id: string, code: string): ITaskAction {
		return {
			type: "TASK_SAVE",
			id,
			code
		};
	}
}