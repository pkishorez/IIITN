import {INR_Task} from '../../../Common/ActionSignature';
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
			state = {...action.tasks};
			break;
		}
		case "TASK_ADD": {
			state = {
				...state,
				[action.id]: action.task
			};
			break;
		}
		case "TASK_SAVE": {
			state = {
				...state,
				[action.id]: {
					saved: action.code
				}
			};
			break;
		}
		case "TASK_MODIFY": {
			let a: INR_Task["TASK_MODIFY"] = action as any;
			state = {
				...state,
				[a.id]: {
					...state[a.id],
					question: a.question,
					resetCode: a.resetCode
				}
			}
			break;
		}
		case "TASK_SAVE_BUFFER": {
			state = {
				...state,
				[action.id]: {
					buffer: action.code
				}
			};
			break;
		}
	}
	return state;
}