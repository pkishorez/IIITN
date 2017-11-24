import {Network} from 'App/Network/';
import {__store, IRootState} from 'App/State';
import {ITaskAction} from 'App/State/Reducers/TaskReducer';
import {IUserAction} from 'App/State/Reducers/UserReducer';
import {INR_User} from 'Common/ActionSignature';
import * as _ from 'lodash';
import { A_Guide, D_Guide } from 'App/State/Action';

export let Me = {
	// Network and local state requests.
	login(data: INR_User["USER_LOGIN"]) {
		return Network.requestAndDispatch("USER_LOGIN", data);
	},
	/*
	saveTask(data: INR_Task["USER_TASK_SAVE"]) {
		return Network.requestAndDispatch("USER_TASK_SAVE", data, A_User.saveTask);
	},
	**/

	// Only network requests.
	register(data: any) {
		return Network.request("REGISTER", data);
	},

	// Only Local state requests.
	saveEditorBuffer(id: string, code: string) {
		this._dispatch({
			type: "USER_SAVE_BUFFER",
			id,
			code
		});
	},
	goOnline() {
		this._dispatch({
			type: "USER_ONLINE"
		});
	},
	goOffline() {
		this._dispatch({
			type: "USER_OFFLINE"
		});
	},
	logout() {
		this._dispatch({
			type: "USER_LOGOUT"
		});
	},
	_dispatch(action: IUserAction) {
		__store.dispatch(action);
	}
};

export let Task = {
	init() {
		this.perform({
			type: "TASK_ACTION",
			orderedMapAction: {
				type: "INIT"
			}
		} as any);
	},
	perform(action: ITaskAction) {
		return Network.requestAndDispatch("TASK_ACTION", action);
	}
};