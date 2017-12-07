import {Collection} from 'Server/Database/index';
import {S_Task} from '../Schema/index';
import {ITaskAction, ITask} from 'App/State/Reducers/TaskReducer';
import {OrderedMap} from 'classui/DataStructures/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';

export class _Task{
	private orderedMap: OrderedMap<ITask>
	// Update task. One action should be there.
	__init() {
		return KeyValue.get("TASKS_DB").then((data)=>{
			return new OrderedMap<ITask>(data, S_Task);
		});
	}
	performAction(action: ITaskAction) {
		return new Promise<ITaskAction>(async (resolve, reject)=>{
			if (!this.orderedMap) {
				this.orderedMap = await this.__init()
			}
			let modifiedAction = this.orderedMap.performAction(action.orderedMapAction);
			if (typeof modifiedAction=="string") {
				return reject(modifiedAction);
			}
			action.orderedMapAction = modifiedAction;
			KeyValue.set("TASKS_DB", this.orderedMap.getState());
			resolve(action);
		}).catch((err)=>{
			console.error(err);
			return Promise.reject(err);
		});
	}
}

export let Task = new _Task();