import {Network} from 'App/Network/';
import {__store, IRootState} from 'App/State';
import {ITaskAction} from 'App/State/Reducers/TaskReducer';
import {IUserAction, IUserSaveTaskDetails} from 'App/State/Reducers/UserReducer';
import {INR_User} from 'Common/ActionSignature';
import * as _ from 'lodash';
import { IGuideAction } from 'App/State/Reducers/GuideReducer';
import { ISessionAction } from 'App/State/Reducers/SessionReducer';
import { Helper } from 'App/Helper';

export let Me = {
	// Network and local state requests.
	login(data: INR_User["USER_LOGIN"]) {
		return Helper.requestAndDispatch("USER_LOGIN", data);
	},

	getUserList() {
		return Helper.requestAndDispatch("USER_LIST");
	},

	submitTask(data: IUserSaveTaskDetails) {
		return Helper.requestAndDispatch("USER_SAVE_TASK", data);
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
			type: "INIT"
		} as any);
	},
	perform(action: ITaskAction["orderedMapAction"]) {
		return Helper.requestAndDispatch("TASK_ACTION", {
			type: "TASK_ACTION",
			orderedMapAction: action
		} as ITaskAction);
	}
};

export let Guide = {
	init() {
		return Helper.requestAndDispatch("GUIDE_ACTION", {
			type: "GUIDE_ACTION",
			orderedMapAction: {
				type: "INIT"
			}
		} as IGuideAction);
	},
	perform(action: IGuideAction["orderedMapAction"]) {
		return Helper.requestAndDispatch("GUIDE_ACTION", {
			type: "GUIDE_ACTION",
			orderedMapAction: action
		} as IGuideAction);
	}
}

export let Session = {
	addStudents(students: string[]) {
		return Helper.requestAndDispatch("SESSION_ADD_STUDENTS", {
			type: "SESSION_ADD_STUDENTS",
			students
		});
	},
	delStudents(students: string[]) {
		return Helper.requestAndDispatch("SESSION_DEL_STUDENTS", {
			type: "SESSION_DEL_STUDENTS",
			students
		});
	},
	sit(pos: string) {
		return Network.request("SESSION_SITTING", {
			pos
		});
	},
	init() {
		return Helper.requestAndDispatch("SESSION_INIT");
	},
	POMPOMMMM(pos: string[]) {
		return Network.request("SESSION_POMPOMMMM", {
			pos
		});
	},
	POMPOMMMMALL() {
		return Network.request("SESSION_POMPOMMMM_ALL");
	},
	getTaskDetails(task_id: string, users: string[]) {
		return Network.request("SESSION_TASK_DETAILS", {
			task_id,
			users
		});
	}
}