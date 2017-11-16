import {Collection} from '../index';
import {v4} from 'uuid';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User} from '../Schema/index';
import {INR_Task, INR_User} from '../../../Common/ActionSignature';
import {TaskDB} from './Task';

export let UserDB: Collection = new Collection("user");

export class User {
	userid: string;

	private constructor(userid: string) {
		this.userid = userid;
	}

	static register(user: any) {
		// Add an empty object for tasks.
		user.tasks = {};
		user.secretKey = v4();
		return UserDB.insert(user, S_User).then((res)=>{
			return Promise.resolve(`User ${user._id} successfully registered.`);
		}).catch((e)=>Promise.reject("User already exists."));
	}
	static login(data: INR_User["USER_LOGIN"]): Promise<{
		ref: User,
		secretKey: string
	}> {
		return UserDB.findOne({_id: data.userid}).then((user)=>{
			if (!user) {
				return Promise.reject("User Not Found.");
			}
			if ((user.password==data.password) || (user.secretKey==data.secretKey)) {
				return Promise.resolve({
					ref: new User(data.userid),
					secretKey: user.secretKey
				});
			}
			return Promise.reject("Invalid password.");
		});
	}
	static getStudents() {
		return UserDB.getMany({}).toArray()
		.catch(()=>{throw "Couldn't get students."});
	}
	static getProfile(userid: string) {
		return UserDB.findOne({_id: userid}).then((res)=>{
			if (!res) {
				return Promise.reject("User Details not found.");
			}
			return Promise.resolve(res);
		}).catch(()=>{
			return Promise.reject("Error getting profile details.");
		});
	}
	getTasks() {
		return Promise.all([
			TaskDB.getMany({}).toObject(),
			UserDB.getMany({_id: this.userid}, {tasks: 1}).toArray()
		]).then(([mainTasks, userTasks])=>{
			return Promise.resolve({
				userTasks: userTasks[0].tasks,
				mainTasks
			});
		}).catch(()=>{
			return Promise.reject("Error getting tasks.")
		});
	}
	saveTask(data: INR_Task["USER_TASK_SAVE"]) {
		return UserDB.raw.updateOne({_id: this.userid}, {
			$set: {
				[`tasks.${data.id}`]: data.code
			}
		}).then(()=>{
			return Promise.resolve("Successfully saved.");
		}).catch(()=>{
			return Promise.reject("Couldn't save.")
		});
	}
}