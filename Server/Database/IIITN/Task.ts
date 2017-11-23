import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {INR_Task} from 'Common/ActionSignature';

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
		return TaskDB.raw.remove({_id: data._id}).then((res)=>{
			return Promise.resolve("Successfully deleted task.");
		})
	}
}