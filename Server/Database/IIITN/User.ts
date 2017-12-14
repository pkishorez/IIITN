import {v4} from 'uuid';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User, IUserTask_Details, ITask} from '../Schema/index';
import {INR_User} from 'Common/ActionSignature';
import { S_UserTask_Details } from 'Server/Database/Schema/Task';
import { IUserAction, IUserSaveTaskDetails } from 'App/State/Reducers/UserReducer';
import { Database } from 'Server/Database';

export class User {
	userid: string;

	private constructor(userid: string) {
		this.userid = userid;
	}

	static register(user: any) {
		// Add an empty object for tasks.
		user.tasks = {};
		user.secretKey = v4();
		return Database.collection("user").insert(user, S_User).then((res)=>{
			return Promise.resolve(`User ${user._id} successfully registered.`);
		}).catch((e)=>Promise.reject("User already exists."));
	}
	static login(data: INR_User["USER_LOGIN"]): Promise<{ref: User} & INR_User["USER_LOGIN"]> {
		return Database.collection("user").findOne({_id: data.userid}).then((user: any)=>{
			if (!user) {
				return Promise.reject("User Not Found.");
			}
			if ((user.password==data.password) || (user.secretKey==data.secretKey)) {
				return Promise.resolve({
					ref: new User(data.userid),
					secretKey: user.secretKey,
					tasks: user.tasks
				});
			}
			return Promise.reject("Invalid password.");
		});
	}
	static getStudents() {
		return Database.collection("user").getMany({}).toArray()
		.catch(()=>{throw "Couldn't get students."});
	}
	static getProfile(userid: string) {
		return Database.collection("user").findOne({_id: userid}).then((res)=>{
			if (!res) {
				return Promise.reject("User Details not found.");
			}
			return Promise.resolve(res);
		}).catch(()=>{
			return Promise.reject("Error getting profile details.");
		});
	}
	saveTask(saveTaskAction: IUserSaveTaskDetails) {
		// Default data if any.
		saveTaskAction.taskDetails = {
			...saveTaskAction.taskDetails
		};
		let error = Schema.validate(S_UserTask_Details, saveTaskAction.taskDetails);
		if (error) {
			return Promise.reject(error);
		}

		return Database.collection("user").raw.updateOne({_id: this.userid}, {
			$set: {
				[`tasks.${saveTaskAction.taskDetails._id}`]: saveTaskAction.taskDetails
			}
		}).then(()=>{
			return Promise.resolve(saveTaskAction);
		}).catch(()=>{
			return Promise.reject("Couldn't save.")
		});
	}
}