import * as _ from 'lodash';
import {IOrderedMapAction, OrderedMap, IOrderedMap} from 'classui/DataStructures/OrderedMap';
import {ITask} from 'Server/Database/Schema/Task';

export {ITask} from 'Server/Database/Schema/Task';

export type ITaskState = IOrderedMap<ITask>;

export type ITaskAction = {
	type: "TASK_ACTION"
	orderedMapAction: IOrderedMapAction<ITask>
}

export let TaskReducer = (state: ITaskState={map: {}, order: []}, action: ITaskAction) => {
	switch(action.type) {
		case "TASK_ACTION": {
			let orderedMapState = new OrderedMap(state);
			orderedMapState.performAction(action.orderedMapAction);
			state = {...orderedMapState.getState()};
			break;
		}
	}
	return state;
}