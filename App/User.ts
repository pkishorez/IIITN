import {SocketIO} from './SocketIO';

export let User = {
	login(data: any) {
		return SocketIO.request("LOGIN", data);
	},
	register(data: any) {
		return SocketIO.request("REGISTER", data);
	}
}