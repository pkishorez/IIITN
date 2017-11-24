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
				if (data) {
					data = data.data;
				}
				this.orderedMap = new OrderedMap(data);
				console.log("Connected TasksDB of KeyValue", data, this.orderedMap.getState());
			});
		}, 5000)
	}
	performAction(action: ITaskAction) {
		return new Promise<ITaskAction>((resolve, reject)=>{
			if (!this.orderedMap) {
				reject("Database Error. Couldn't perform task.");
			}
			if (action.orderedMapAction.type=="INIT") {
				resolve({
					...action,
					orderedMapAction: {
						...action.orderedMapAction,
						state: this.orderedMap.getState()
					}
				});
			}
			this.orderedMap.performAction(action.orderedMapAction);
			KeyValue.set("TASKS_DB", this.orderedMap.getState());
			resolve(action);
		}).catch(console.error);
	}
}

export let Task = new _Task();