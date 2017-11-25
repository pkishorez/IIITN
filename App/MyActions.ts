import {Network} from 'App/Network/';
import {__store, IRootState} from 'App/State';
import {ITaskAction} from 'App/State/Reducers/TaskReducer';
import {IUserAction} from 'App/State/Reducers/UserReducer';
import {INR_User} from 'Common/ActionSignature';
import * as _ from 'lodash';
import { IGuideAction } from 'App/State/Reducers/GuideReducer';

export let Me = {
	// Network and local state requests.
	login(data: INR_User["USER_LOGIN"]) {
		return Network.requestAndDispatch("USER_LOGIN", data);
	},

	saveTask(data: INR_User["USER_SAVE_TASK"]) {
		return Network.requestAndDispatch("USER_SAVE_TASK", data);
	},

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

export let Guide = {
	init() {
		Network.requestAndDispatch("GUIDE_INIT", {});
	},
	perform(action: IGuideAction) {
		return Network.requestAndDispatch("GUIDE_MODULE_ACTION", action);
	}
}