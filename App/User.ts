import {SocketIO} from './SocketIO';

export let User = {
	login(data: any) {
		return SocketIO.request("LOGIN", data);
	},
	register(data: any) {
		return SocketIO.request("REGISTER", data);
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