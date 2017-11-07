export interface ITask {
	question: string
	resetCode: string
	saved: string
	buffer?: string
}
export interface ITaskState {
	[id: string]: ITask
}

export type ITaskActionType = "TASK_ADD" | "TASK_SAVE" | "TASK_SAVE_BUFFER" | "TASK_INIT";
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
			state[action.id] = action.task;
			break;
		}
		case "TASK_SAVE": {
			state[action.id] = {
				...state[action.id],
				saved: action.code
			};
			break;
		}
		case "TASK_SAVE_BUFFER": {
			state[action.id] = {
				...state[action.id],
				buffer: action.code
			};
			break;
		}
	}
	return state;
}