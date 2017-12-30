import {v4} from 'uuid';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User, IUserTask_Details, ITask} from '../Schema/index';
import {INR_User} from 'Common/ActionSignature';
import { S_UserTask_Details } from 'Server/Database/Schema/Task';
import { IUserAction, IUserSaveTaskDetails } from 'App/State/Reducers/UserReducer';
import { Database } from 'Server/Database';
import * as _ from 'lodash';
import { Session } from 'Server/Database/IIITN/Session';
import { IRequest, IRequestType } from 'Server/Connection';

export class User {
	private static userList: {
		[id: string]: {
			socket: SocketIO.Socket
		}[]
	} = {};
	readonly userid: string;
	readonly socket: SocketIO.Socket;

	private constructor(userid: string, socket: SocketIO.Socket) {
		this.userid = userid;
		this.socket = socket;

		if (!User.userList[userid]) {
			User.userList[userid] = [];
		}
		User.userList = {
			...User.userList,
			[userid]: [
				...User.userList[userid],
				{
					socket
				}
			]
		};
		User.broadCast(User.getOnlineUserList(), {
			type: "USER_ONLINE_LIST",
			list: User.getOnlineUserList()
		});
		this.socket.on("disconnect", ()=>{
			if (_.isArray(User.userList[this.userid]) && User.userList[this.userid].length>1) {
				User.userList = {
					...User.userList,
					[this.userid]: User.userList[this.userid].filter((instance)=>{
						if (instance.socket==this.socket)
							return false;
						return true;
					})
				};
			}
			else {
				User.userList = _.omit(User.userList, this.userid);
			}
			User.broadCast(User.getOnlineUserList(), {
				type: "USER_ONLINE_LIST",
				list: User.getOnlineUserList()
			});
		})
	}
	static broadCast(list: string[], data: any) {
		list.map((user)=>{
			if (!_.isArray(User.userList[user])) {
				return;
			}
			User.userList[user].forEach((stats)=>{
				try {
					stats.socket.emit("PASSIVE_ACTION", data);
				}
				catch(e) {
					console.error("COULDN'T SEND TO "+user);
				}
			})
		});
	}
	static getOnlineUserList() {
		return Object.keys(this.userList);
	}

	static register(user: any) {
		// Add an empty object for tasks.
		user.tasks = {};
		user.secretKey = v4();
		return Database.collection("user").insert(user, S_User).then((res)=>{
			return Promise.resolve(`User ${user._id} successfully registered.`);
		}).catch((e)=>Promise.reject("User already exists."));
	}
	static login(data: INR_User["USER_LOGIN"], socket: SocketIO.Socket): Promise<{ref: User} & INR_User["USER_LOGIN"]> {
		return Database.collection("user").get({_id: data.userid}).then((user)=>{
			if ((user.password==data.password) || (user.secretKey==data.secretKey)) {
				return Promise.resolve({
					ref: new User(data.userid, socket),
					secretKey: user.secretKey,
					tasks: user.tasks,
					onlineList: this.getOnlineUserList()
				});
			}
			return Promise.reject("Invalid password.");
		});
	}
	static getStudents() {
		return Database.collection("user").getMany({role: "student"}).toArray().then((data)=>{
			return {
				list: data.map((obj: any)=>_.omit(obj, ["password", "secretKey"]))
			};
		})
		.catch(()=>Promise.reject("Couldn't get students."));
	}
	static getProfile(userid: string) {
		return Database.collection("user").get({
			_id: userid
		}).catch(()=>Promise.reject("Error getting profile details."));
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

		return Database.collection("user").deep(this.userid, `tasks.${saveTaskAction.taskDetails._id}`).update(
			saveTaskAction.taskDetails
		).then(()=>{
			if ((saveTaskAction.taskDetails.type=="TYPESCRIPT_TESTCASE_TASK") && (saveTaskAction.taskDetails.test_cases_passed>0)) {
				Session.taskSubmitted(this.userid, saveTaskAction.taskDetails._id);
			}
			return saveTaskAction;
		})
	}
	static getTaskDetails(task_id: string, users: string[]) {
		let passed: string[] = [];
		return Database.collection("user").getMany({}, {tasks: 1}).toObject().then((allDetails)=>{
			users.forEach((user)=>{
				let userDetails = allDetails[user];
				if (_.isPlainObject(userDetails) && userDetails.tasks) {
					let taskDetails: IUserTask_Details = userDetails.tasks[task_id];
					if (taskDetails && taskDetails.type=="TYPESCRIPT_TESTCASE_TASK") {
						if (_.isNumber(taskDetails.test_cases_passed)) {
							passed = [...passed, user];
						}
					}
				}
			});
			return passed;
		}).catch((e)=>{
			return Promise.reject("COULDN't");
		});
	}
}