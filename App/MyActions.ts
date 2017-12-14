import {Network} from 'App/Network/';
import {__store, IRootState} from 'App/State';
import {ITaskAction} from 'App/State/Reducers/TaskReducer';
import {IUserAction, IUserSaveTaskDetails} from 'App/State/Reducers/UserReducer';
import {INR_User} from 'Common/ActionSignature';
import * as _ from 'lodash';
import { IGuideAction } from 'App/State/Reducers/GuideReducer';

export let Me = {
	// Network and local state requests.
	login(data: INR_User["USER_LOGIN"]) {
		return Network.requestAndDispatch("USER_LOGIN", data);
	},

	submitTask(data: IUserSaveTaskDetails) {
		return Network.requestAndDispatch("USER_SAVE_TASK", data);
	},

	// Only network requests.
	register(data: any) {
		return Network.request("REGISTER", data);
	},

	// Only Local state requests.
	saveEditorBuffer(id: string, code: string) {
		Me._dispatch({
			type: "USER_SAVE_BUFFER",
			id,
			code
		});
	},
	goOnline() {
		Me._dispatch({
			type: "USER_ONLINE"
		});
	},
	goOffline() {
		Me._dispatch({
			type: "USER_OFFLINE"
		});
	},
	logout() {
		Me._dispatch({
			type: "USER_LOGOUT"
		});
	},
	_dispatch(action: IUserAction) {
		__store.dispatch(action);
	}
};

export let Task = {
	init() {
		return Task.perform({
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
		return Network.requestAndDispatch("GUIDE_ACTION", {
			type: "GUIDE_ACTION",
			orderedMapAction: {
				type: "INIT"
			}
		} as IGuideAction);
	},
	perform(action: IGuideAction) {
		return Network.requestAndDispatch("GUIDE_ACTION", action);
	}
}