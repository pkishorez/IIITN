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
	}
}