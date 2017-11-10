import {Network} from './Network/';

export let User = {
	login(data: any) {
		return Network.request("LOGIN", data);
	},
	register(data: any) {
		return Network.request("REGISTER", data);
	}
};

export let Task = {
	add(data: any) {
		return Network.request("TASK_ADD", data);
	},
	get() {
		return Network.request("TASK_GET");
	},
	save(id: string, code: string) {
		let data = {
			id,
			code
		};
		return Network.request("TASK_SAVE", data);
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