export interface IUserState {
	userid: string | null
}

export type IUserActionType = "USER_LOGIN" | "USER_REGISTER"

export interface IUserAction {
	type: IUserActionType
	[id: string]: any
}
let defaultState: IUserState = {
	userid: null
};

export let UserReducer = (state: IUserState = defaultState, action: IUserAction) => {
	switch(action.type) {
		case "USER_LOGIN": {
			state = {
				...state,
				userid: action.userid
			}
			break;
		}
	}
	return state;
}