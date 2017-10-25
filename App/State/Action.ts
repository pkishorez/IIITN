import {IUserAction} from './UserReducer';

export let A_User = {
	login(userid: string): IUserAction {
		return {
			type: "USER_LOGIN",
			userid
		};
	},
	logout() {
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