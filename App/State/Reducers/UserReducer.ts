import {INR_User} from 'Common/ActionSignature';
export interface IUserState {
	userid: string | null
	secretKey?: string | null
	online: boolean
	editorBuffers: {
		[id: string]: string
	}
	tasks: {
		[id: string]: string
	}
}

export type IUserAction = {
	type: "USER_LOGOUT"
} | {
	type: "USER_ONLINE" | "USER_OFFLINE"
} | {
	type: "USER_SAVE_BUFFER"
	id: string
	code: string
} | (INR_User["USER_SAVE_TASK"] & {
	type: "USER_SAVE_TASK"
})| (INR_User["USER_LOGIN"] & {
	type: "USER_LOGIN"
})

export type IUserActionType = IUserAction["type"] | keyof(INR_User)

let defaultState: IUserState = {
	userid: null,
	secretKey: null,
	online: false,
	editorBuffers: {},
	tasks: {}
};

export let UserReducer = (state: IUserState = defaultState, action: IUserAction) => {
	switch(action.type) {
		case "USER_LOGIN": {
			state = {
				...state,
				userid: action.userid,
				secretKey: action.secretKey,
				tasks: action.tasks?action.tasks:{}
			}
			break;
		}
		case "USER_OFFLINE": {
			state = {
				...state,
				online: false
			}
			break;
		}
		case "USER_ONLINE": {
			state = {
				...state,
				online: true
			}
			break;
		}
		case "USER_SAVE_BUFFER": {
			state = {
				...state,
				editorBuffers: {
					...state.editorBuffers,
					[action.id]: action.code
				}
			}
			break;
		}
		case "USER_SAVE_TASK": {
			state = {
				...state,
				tasks: {
					...state.tasks,
					[action.id]: action.code
				}
			}
		}
	}
	return state;
}