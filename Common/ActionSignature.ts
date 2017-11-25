import {ITask} from 'App/State/Reducers/TaskReducer';

export interface INR_User {
	USER_LOGIN: {
		userid: string
		password?: string
		secretKey?: string
		tasks?: any
	}
	USER_SAVE_TASK: {
		id: string
		code: string
	}
}