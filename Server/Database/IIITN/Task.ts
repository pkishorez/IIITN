import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {ITaskAction, ITask} from 'App/State/Reducers/TaskReducer';
import {OrderedMap} from 'Utils/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';

export class _Task{
	private orderedMap: OrderedMap<ITask>
	// Update task. One action should be there.
	__init() {
		return KeyValue.get("TASKS_DB").then((data)=>{
			return new OrderedMap<ITask>(data);
		});
	}
	performAction(action: ITaskAction) {
		return new Promise<ITaskAction>(async (resolve, reject)=>{
			if (!this.orderedMap) {
				this.orderedMap = await this.__init()
			}
			action.orderedMapAction = this.orderedMap.performAction(action.orderedMapAction);
			KeyValue.set("TASKS_DB", this.orderedMap.getState());
			resolve(action);
		}).catch(console.error);
	}
}

export let Task = new _Task();