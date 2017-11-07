import {SocketIO} from './SocketIO';

export let User = {
	login(data: any) {
		return SocketIO.request("LOGIN", data);
	},
	register(data: any) {
		return SocketIO.request("REGISTER", data);
	}
};

export let Task = {
	add(data: any) {
		return SocketIO.request("TASK_ADD", data);
	},
	get() {
		return SocketIO.request("TASK_GET");
	},
	save(id: string, code: string) {
		let data = {
			id,
			code
		};
		return SocketIO.request("TASK_SAVE", data);
	}
};

export let Database = {
	getStudents() {
		return SocketIO.request("STUDENTS");
	},
	getProfile(userid: string) {
		return SocketIO.request("PROFILE", {
			userid
		});
	}
}