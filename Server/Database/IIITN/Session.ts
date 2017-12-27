import {v4} from 'uuid';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User, IUserTask_Details, ITask} from '../Schema/index';
import * as _ from 'lodash';
import { Database } from 'Server/Database';
import { User } from 'Server/Database/IIITN';
import { Promise } from 'es6-promise';

export class Session {
	static sitting: {
		[id: string]: string
	};
	static users: string[] = []
	static init() {
		console.log("SUCCESSFULLY DONE :)");
		return Database.collection("session").get({_id: "session"}).then((data)=>{
			this.sitting = data.sitting?data.sitting:{};
			this.users = data.list;
		});
	}
	static delStudents(students: string[]) {
		return Database.collection("session").deep("session", "list").removeFromSet(students)
		.then(()=>Promise.resolve("Deleted Students :)"));
	}
	static addStudents(students: string[]) {
		return Database.collection("session").deep("session", "list").appendSet(students)
		.then(()=>Promise.resolve("Added Students :)"));
	}
	static getStudents() {
		return Database.collection("session").get({_id: "session"}).then((data)=>{
			return {
				list: data.list
			};
		});
	}
	static pompomm(pos: string) {
		if (this.sitting && this.sitting[pos]) {
			User.broadCast([this.sitting[pos]], {
				type: "SESSION_POMPOMMMM"
			});
			return Promise.resolve("POMPOMMMM :)");
		}
		return Promise.reject("Couldn't POMPOMMM");
	}
	static pompommAll() {
		User.broadCast(User.getOnlineUserList(), {
			type: "SESSION_POMPOMMMM"
		});
		return Promise.resolve("POMPOMMMM :)");
	}
	static sit(userid: string, pos: string) {
		if (userid=="admin") {
			return Promise.reject("Admin cannot sit anywhere :(");
		}
		if (!this.sitting) {
			return Promise.reject("Database not ready yet.");
		}
		if (this.sitting[pos]) {
			if (this.sitting[pos]==userid) {
				return Promise.reject("YOU HAVE ALREADY SAT THERE :(((");
			}
			return Promise.reject("Somone has already sat at that place :( Ask them to move away.");
		}
		Object.keys(this.sitting).forEach((key)=>{
			if (this.sitting[key]==userid) {
				this.sitting = _.omit(this.sitting, key);
			}
		});
		this.sitting[pos] = userid;
		return Database.collection("session").deep("session", "sitting").update(this.sitting).then(()=>{
			User.broadCast([...this.users, "admin"], {
				type: "SESSION_SITTING",
				sitting: this.sitting
			});
		});
	}
}
setTimeout(()=>{
	Session.init();
}, 5000)