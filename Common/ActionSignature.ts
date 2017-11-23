import {ITask} from 'App/State/Reducers/TaskReducer';

export interface INR_User {
	USER_LOGIN: {
		userid: string
		password?: string
		secretKey?: string
	}
}

export interface INR_Task {
	TASK_ADD: ({
		_id?: string // Mandatory for local, not mandatory for network.
	} & ITask)
	TASK_MODIFY: ({
		_id: string
	} & Partial<ITask>)
	USER_TASK_SAVE: {
		_id: string
		code: string
	}
	TASK_DELETE: {
		_id: string
	}
}