import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {ITaskAction, ITask} from 'App/State/Reducers/TaskReducer';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';
import {OrderedMapDatabase} from '../Utils/OrderedMapDatabase';

export class _Task{
	orderedMapDatabase: OrderedMapDatabase<ITask>;
	// Update task. One action should be there.
	constructor() {
		this.orderedMapDatabase = new OrderedMapDatabase<ITask>(new Collection("tasks"), S_Task);
	}
	performAction(action: ITaskAction) {
		let status = this.orderedMapDatabase.performAction(action.orderedMapAction);
		return status.then((omAction)=>{
			console.log(action);
			action.orderedMapAction = omAction;
			return Promise.resolve(action);
		}).catch((error)=>{
			console.log(error);
			return Promise.reject("Couldn't perform action.");
		});
	}
}

export let Task = new _Task();