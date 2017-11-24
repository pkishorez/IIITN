import {Network} from 'App/Network/';
import {A_User, A_Task, __store, IRootState} from 'App/State';
import {INR_User, INR_Task} from 'Common/ActionSignature';
import * as _ from 'lodash';
import { A_Guide, D_Guide } from 'App/State/Action';

export let Me = {
	// Network and local state requests.
	login(data: INR_User["USER_LOGIN"]) {
		return Network.requestAndDispatch("USER_LOGIN", data, A_User.login);
	},
	saveTask(data: INR_Task["USER_TASK_SAVE"]) {
		return Network.requestAndDispatch("USER_TASK_SAVE", data, A_User.saveTask);
	},

	// Only network requests.
	register(data: any) {
		return Network.request("REGISTER", data);
	},

	// Only Local state requests.
	saveEditorBuffer(id: string, code: string) {
		return __store.dispatch(A_User.saveEditorBuffer(id, code));
	},
	goOnline() {
		__store.dispatch(A_User.goOnline());
	},
	goOffline() {
		__store.dispatch(A_User.goOffline());
	},
	logout() {
		__store.dispatch(A_User.logout());
	}

};

export let Task = {
	add(data: INR_Task["TASK_ADD"]) {
		return Network.requestAndDispatch("TASK_ADD", data, A_Task.add)
	},
	init() {
		return Network.request("TASK_GET").then((ts: any)=>{
			let tasks: IRootState["tasks"] = {};
			// Compute tasks from ts.

			for (let i in ts.mainTasks) {
				let t = ts.mainTasks[i];
				tasks[i] = {
					question: t.question,
					resetCode: t.resetCode,
					saved: ts.userTasks[i]
				};
			}
			__store.dispatch(A_Task.init(tasks));
		});
	},
	modify(data: INR_Task["TASK_MODIFY"]) {
		return Network.requestAndDispatch("TASK_MODIFY", data, A_Task.modify);
	},
	delete(data: INR_Task["TASK_DELETE"]) {
		return Network.requestAndDispatch("TASK_DELETE", data, A_Task.delete)
	}
};

let KeyValue = {
	set(key: string, value: string) {
		return Network.request("KEYVALUE_SET", {
			key,
			value
		})
	},
	get(key: string) {
		return Network.request("KEYVALUE_GET", {
			key
		});
	}
}

export let Guide ={
	get: D_Guide,
	save() {
		if (_.isEqual(__store.getState().guides, {})) {
			alert("Empty Guides. Cannot save :(");
			return;
		}
		KeyValue.set("GUIDES", JSON.stringify(__store.getState().guides));
	},
	init() {
		KeyValue.get("GUIDES").then((data: string)=>{
			let remoteGuides = JSON.parse(data);
			let localGuides = __store.getState().guides;
			if (_.isEqual(localGuides, {})) {
				__store.dispatch(A_Guide.INIT(remoteGuides));
				return;
			}
			if (!_.isEqual(localGuides, remoteGuides)) {
				if (confirm("Do you want to override local guides with remote guides?")) {
					__store.dispatch(A_Guide.INIT(remoteGuides));
				}
			}
		})
	}
};

export let Database = {
	getStudents() {
		return Network.request("STUDENTS");
	},
	getProfile(userid: string) {
		return Network.request("PROFILE", {
			userid
		});
	}
}