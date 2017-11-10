import {Network} from './Network/';
import {A_User, A_Task, store} from './State';
import {INR_User, INR_Task} from '../Common/ActionSignature';

export let User = {
	// Network and local store request.
	login(data: INR_User["USER_LOGIN"]) {
		return Network.requestAndDispatch("USER_LOGIN", data, A_User.login);
	},
	// Only network request.
	register(data: any) {
		return Network.request("REGISTER", data);
	},
	saveTask(data: INR_Task["USER_TASK_SAVE"]) {
		return Network.requestAndDispatch("USER_TASK_SAVE", data, A_User.saveTask);
	}
};

export let Task = {
	add(data: INR_Task["TASK_ADD"]) {
		return Network.requestAndDispatch("TASK_ADD", data, A_Task.add)
	},
	get() {
		return Network.request("TASK_GET");
	},
	modify(data: INR_Task["TASK_MODIFY"]) {
		return Network.requestAndDispatch("TASK_MODIFY", data, A_Task.modify);
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