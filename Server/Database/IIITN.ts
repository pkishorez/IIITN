import {DB} from './';
import {Schema} from 'classui/Components/Form/Schema';
import {S_User, S_Task} from './Schema';
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
		return DB.then<mongodb.Db>(db=>Promise.resolve(db), REJECT("Failed to connect database."));
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
	static addTask(data: any) {
		let error = Schema.validate(S_Task, data);
		if (error){
			return Promise.reject(error);
		}

		return this.db.then((db)=>{
			return db.collection("task").insertOne(data).then(()=>{
				return Promise.resolve("Successfully added.");
			}).catch(REJECT("Couldn't add task."));
		})
	}
	static modifyTask(data: any) {
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
		return DB.then<mongodb.Db>(db=>Promise.resolve(db), REJECT("Failed to connect database."));
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
	static login(userid: string, password: string, secretKey: string) {
		return this.db.then((db)=>{
			return db.collection("user").findOne({_id: userid}).then((res)=>{
				// User Found.
				if (!res) {
					return Promise.reject("User Not Found.");
				}
				if ((res.password==password) || (res.secretKey==secretKey)) {
					return Promise.resolve({
						ref: new User(userid),
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
	saveTask(id: string, code: string) {
		let task: any = {};
		task["tasks."+id] = code;
		return this.db.then((db)=>{
			return db.collection("user").updateOne({_id: this.userid}, {
				$set: task
			}).then(()=>{
				return Promise.resolve("Successfully saved.");
			}).catch((e)=>Promise.reject("Couldn't save."+JSON.stringify(e)));
		})
	}
}