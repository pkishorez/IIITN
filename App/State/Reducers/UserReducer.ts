import {INR_User} from '../../../Common/ActionSignature';
export interface IUserState {
	userid: string | null
	secretKey?: string | null
	online: boolean
	editorBuffers: {
		[id: string]: string
	}
}

export type IUserActionType = "USER_LOGOUT" | "USER_OFFLINE" | "USER_ONLINE" | "USER_SAVE_BUFFER" | keyof(INR_User)

export interface IUserAction {
	type: IUserActionType
	[id: string]: any
}
let defaultState: IUserState = {
	userid: null,
	secretKey: null,
	online: false,
	editorBuffers: {}
};

export let UserReducer = (state: IUserState = defaultState, action: IUserAction) => {
	switch(action.type) {
		case "USER_LOGIN": {
			state = {
				...state,
				userid: action.userid,
				secretKey: action.secretKey
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
	}
	return state;
}