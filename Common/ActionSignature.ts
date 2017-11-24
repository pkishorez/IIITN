import {ITask} from 'App/State/Reducers/TaskReducer';

export interface INR_User {
	USER_LOGIN: {
		userid: string
		password?: string
		secretKey?: string
	}
}