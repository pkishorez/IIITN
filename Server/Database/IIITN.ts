import {MongoDB} from './';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User, S_Task} from './Schema';
import {INR_Task, INR_User} from '../../Common/ActionSignature'
import {Promise} from 'es6-promise';
import {v4} from 'uuid';
import * as mongodb from 'mongodb';

let REJECT = (error: string)=>{
	return ()=>{
		return Promise.reject(error);
	}
}

export class Database {
	private static get db(){
		return MongoDB.db.then<mongodb.Db>(db=>Promise.resolve(db), REJECT("Failed to connect database."));
	}
	private get db() {
		return Database.db;
	}

	// Database related Functions all goes here...

	static getStudents() {
		return this.db.then((db)=>{
			return db.collection("user").find({}).toArray().then(arr=>{
				arr = arr.map((user)=>{
					return User.getProfile(user);
				});
				return Promise.resolve(arr);
			}).catch(REJECT("Request Failed."));
		})
	}
	static getProfile(userid: string) {
		return this.db.then((db)=>{
			return db.collection("user").findOne({_id: userid}).then((res)=>{
				if (!res) {
					return Promise.reject("User Details not found.");
				}
				return Promise.resolve(res);
			})
		})
	}
	static addTask(data: INR_Task["TASK_ADD"]) {
		let error = Schema.validate(S_Task, data.task);
		if (error){
			return Promise.reject(error);
		}

		return this.db.then((db)=>{
			return db.collection("task").insertOne(data.task).then<INR_Task["TASK_ADD"]>((res)=>{
				return Promise.resolve({
					id: res.insertedId.toString(),
					task: data.task
				});
			}).catch(REJECT("Couldn't add task."));
		})
	}
	static modifyTask(data: INR_Task["TASK_MODIFY"]) {
		let error = Schema.validate(S_Task, data);
		if (error){
			return Promise.reject(error);
		}

		return this.db.then((db)=>{
			return db.collection("task").updateOne({_id: new mongodb.ObjectID(data.id)}, data).then(()=>{
				return Promise.resolve("Successfully Modified.");
			}).catch(REJECT("Couldn't modify task."));
		})

	}
}

export class User {
	userid: string;

	private constructor(userid: string) {
		this.userid = userid;
	}
	private static get db(){
		return MongoDB.db.then<mongodb.Db>(db=>Promise.resolve(db), REJECT("Failed to connect database."));
	}
	private get db() {
		return User.db;
	}
	static register(user: any) {
		let error = Schema.validate(S_User, user);
		if (error){
			return Promise.reject(error);
		}
		// Add an empty object for tasks.
		user.tasks = {};
		user.secretKey = v4();
		return this.db.then((db)=>{
			return db.collection("user").insertOne(user).then((res)=>{
				return Promise.resolve(`User ${user._id} successfully registered.`);
			}).catch(REJECT("User Already Exist."));
		});
	}
	static login(data: INR_User["USER_LOGIN"]) {
		return this.db.then((db)=>{
			return db.collection("user").findOne({_id: data.userid}).then((res)=>{
				// User Found.
				if (!res) {
					return Promise.reject("User Not Found.");
				}
				if ((res.password==data.password) || (res.secretKey==data.secretKey)) {
					return Promise.resolve({
						ref: new User(data.userid),
						secretKey: res.secretKey
					});
				}
				return Promise.reject("Invalid password.");

			})
		});
	}
	static getProfile(data: any) {
		return data;
	}
	getTasks() {
		return this.db.then((db)=>{
			return db.collection("task").find({}).toArray().then(mainTasks=>{
				return db.collection("user").find({_id: this.userid}, {tasks: 1}).toArray().then((userTasks)=>{
					return Promise.resolve({
						userTasks,
						mainTasks
					});
				}).catch(REJECT("Couldn't get tasks"));
			}).catch(REJECT("Couldn't get tasks."));
		})
	}
	saveTask(data: INR_Task["USER_TASK_SAVE"]) {
		return this.db.then((db)=>{
			return db.collection("user").updateOne({_id: this.userid}, {
				$set: {
					["tasks."+data.id]: data.code
				}
			}).then(()=>{
				return Promise.resolve("Successfully saved.");
			}).catch((e)=>Promise.reject("Couldn't save."+JSON.stringify(e)));
		})
	}
}