import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {ITaskAction, ITask} from 'App/State/Reducers/TaskReducer';
import {OrderedMap} from 'Utils/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';

export class _Task{
	private orderedMap: OrderedMap<ITask>
	// Update task. One action should be there.
	constructor() {
		setTimeout(()=>{
			KeyValue.get("TASKS_DB").then((data)=>{
				this.orderedMap = new OrderedMap(data);
			}).catch(console.error);
		}, 5000)
	}
	performAction(action: ITaskAction) {
		return new Promise<ITaskAction>((resolve, reject)=>{
			if (!this.orderedMap) {
				reject("Database Error. Couldn't perform task.");
			}
			action.orderedMapAction = this.orderedMap.performAction(action.orderedMapAction);
			KeyValue.set("TASKS_DB", this.orderedMap.getState());
			resolve(action);
		}).catch(console.error);
	}
}

export let Task = new _Task();