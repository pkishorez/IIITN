import {S_Task} from 'Server/Database/Schema/index';
import {ITaskAction, ITask} from 'App/State/Reducers/TaskReducer';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';
import {OrderedMapDatabase} from 'Server/Database/Utils/OrderedMapDatabase';
import { Database } from 'Server/Database';

export class _Task{
	orderedMapDatabase: OrderedMapDatabase<ITask>;
	// Update task. One action should be there.
	performAction(action: ITaskAction) {
		if (!this.orderedMapDatabase) {
			this.orderedMapDatabase = new OrderedMapDatabase<ITask>(Database.collection("tasks"), S_Task);			
		}
		let status = this.orderedMapDatabase.performAction(action.orderedMapAction);
		return status.then((omAction)=>{
			action.orderedMapAction = omAction;
			return Promise.resolve(action);
		}).catch((error)=>{
			console.log(error);
			return Promise.reject("Couldn't perform action.");
		});
	}
}

export let Task = new _Task();