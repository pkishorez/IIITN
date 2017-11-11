import {ITask} from '../App/State/Reducers/TaskReducer';

export interface INR_User {
	USER_LOGIN: {
		userid: string
		password?: string
		secretKey?: string
	}
}

export interface INR_Task {
	TASK_ADD: ({
		id?: string // Mandatory for local, not mandatory for network.
	} & ITask)
	TASK_MODIFY: ({
		id: string
	} & Partial<ITask>)
	USER_TASK_SAVE: {
		id: string
		code: string
	}
}