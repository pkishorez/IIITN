export interface IUserState {
	userid: string | null
	secretKey: string | null
	online: boolean
}

export type IUserActionType = "USER_LOGIN" | "USER_OFFLINE" | "USER_ONLINE"

export interface IUserAction {
	type: IUserActionType
	[id: string]: any
}
let defaultState: IUserState = {
	userid: null,
	secretKey: null,
	online: false
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
	}
	return state;
}