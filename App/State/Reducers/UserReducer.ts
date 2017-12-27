import {INR_User} from 'Common/ActionSignature';
import {IUserTask_Details} from 'Server/Database/Schema/Task';
export interface IUserState {
	userid: string | null
	secretKey?: string | null
	online: boolean
	editorBuffers: {
		[_id: string]: string
	}
	taskDetails: {
		[_id: string]: IUserTask_Details | undefined
	}
	list: any[]
	onlineUserList: string[]
}

export type IUserSaveTaskDetails = {
	type: "USER_SAVE_TASK"
	taskDetails: IUserTask_Details
};

export type IUserAction = {
	type: "USER_LOGOUT"
} | {
	type: "USER_ONLINE" | "USER_OFFLINE"
} | {
	type: "USER_SAVE_BUFFER"
	id: string
	code: string
} | IUserSaveTaskDetails
  | (INR_User["USER_LOGIN"] & {
	type: "USER_LOGIN"
})| {
	type: "USER_LIST"
	list: any[]
} | {
	type: "USER_ONLINE_LIST"
	list: string[]
}

export type IUserActionType = IUserAction["type"] | keyof(INR_User)

let defaultState: IUserState = {
	userid: null,
	secretKey: null,
	online: false,
	editorBuffers: {},
	taskDetails: {},
	list: [],
	onlineUserList: []
};

export let UserReducer = (state: IUserState = defaultState, action: IUserAction) => {
	switch(action.type) {
		case "USER_LOGIN": {
			state = {
				...state,
				userid: action.userid,
				secretKey: action.secretKey,
				taskDetails: action.tasks?action.tasks:{},
				onlineUserList: action.onlineList
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
		case "USER_ONLINE_LIST": {
			state = {
				...state,
				onlineUserList: action.list
			};
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
			if (action.taskDetails){
				state = {
					...state,
					taskDetails: {
						...state.taskDetails,
						[action.taskDetails._id]: action.taskDetails
					}
				}
			}
			break;
		}
		case "USER_LIST": {
			state = {
				...state,
				list: action.list
			};
			break;
		}
	}
	return state;
}