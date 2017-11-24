import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {INR_Task} from 'Common/ActionSignature';
import * as mongodb from 'mongodb';

export let TaskDB: Collection = new Collection("task");

export class Task{
	// Update task. One action should be there.
	static addTask(data: INR_Task["TASK_ADD"]) {
		return TaskDB.insert(data, S_Task).then((res)=>{
			return Promise.resolve("Successfully added task.");
		})
	}
	static modifyTask(data: INR_Task["TASK_MODIFY"]) {
		return TaskDB.update(data, S_Task).then((res)=>{
			return Promise.resolve("Successfully updated task.");
		})
	}
	static deleteTask(data: INR_Task["TASK_DELETE"]) {
		if (data._id.length!=24) {
			return Promise.reject("Invalid ID to delete.");
		}
		return TaskDB.raw.remove({_id: new mongodb.ObjectID(data._id)}).then((res)=>{
			return Promise.resolve("Successfully deleted task.");
		})
	}
}