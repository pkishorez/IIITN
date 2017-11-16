import {INR_Task} from '../../../Common/ActionSignature';
import * as _ from 'lodash';
export interface ITask {
	question: string
	resetCode: string
	saved: string
	buffer?: string
}
export interface ITaskState {
	[id: string]: ITask
}

export type ITaskActionType = "TASK_SAVE_BUFFER" | "TASK_INIT" | keyof(INR_Task)
export interface ITaskAction {
	type: ITaskActionType
	[id: string]: any
}

export let TaskReducer = (state: ITaskState = {}, action: ITaskAction) => {
	switch(action.type) {
		case "TASK_INIT": {
			for (let i in action.tasks) {
				state[i] = {
					...state[i],
					...action.tasks[i]
				};
			}
			let deleted = _.difference(Object.keys(state), Object.keys(action.tasks));
			for (let i=0; i<deleted.length; i++) {
				delete state[deleted[i]];
			}
			state = {...state};
			break;
		}
		case "TASK_ADD": {
			state = {
				...state,
				[action.id]: action.task
			};
			break;
		}
		case "USER_TASK_SAVE": {
			state = {
				...state,
				[action.id]: {
					...state[action.id],
					saved: action.code
				}
			};
			break;
		}
		case "TASK_MODIFY": {
			let a: INR_Task["TASK_MODIFY"] = action as any;
			let {id, ...updates} = a;
			state = {
				...state,
				[id]: {
					...state[a.id],
					...updates
				}
			}
			break;
		}
		case "TASK_SAVE_BUFFER": {
			state = {
				...state,
				[action.id]: {
					...state[action.id],
					buffer: action.code
				}
			};
			break;
		}
	}
	return state;
}