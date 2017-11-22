import {IUserAction} from './Reducers/UserReducer';
import {ITaskAction, ITaskState, ITask} from './Reducers/TaskReducer';
import {INR_Task, INR_User} from '../../Common/ActionSignature';
import { IGuideAction } from './Reducers/GuideReducer';

export let A_User = {
	// NETWORK requests goes here.
	login(data: INR_User["USER_LOGIN"]): IUserAction {
		return {
			type: "USER_LOGIN",
			...data
		};
	},

	// Local Requests goes here.
	logout(): IUserAction {
		return {
			type: "USER_LOGOUT"
		};
	},
	goOnline(): IUserAction {
		return {
			type: "USER_ONLINE"
		}
	},
	goOffline(): IUserAction {
		return {
			type: "USER_OFFLINE"
		}
	},
	saveTask(data: INR_Task["USER_TASK_SAVE"]): ITaskAction {
		return {
			type: "USER_TASK_SAVE",
			...data
		};
	},
	saveEditorBuffer(id: string, code: string): IUserAction {
		return {
			type: "USER_SAVE_BUFFER",
			id,
			code
		};
	}
}

export let A_Task = {

	// NETWORK REQUESTS GOES HERE.
	init(tasks: ITaskState): ITaskAction {
		return {
			type: "TASK_INIT",
			tasks
		};
	},
	add(data: INR_Task["TASK_ADD"]): ITaskAction {
		return {
			type: "TASK_ADD",
			...data
		}
	},
	modify(data: INR_Task["TASK_MODIFY"]): ITaskAction {
		return {
			type: "TASK_MODIFY",
			...data
		};
	}
}

export let A_Guide = (guide_id: string)=>{
	return {
		addLesson(title: string, editorState: string): IGuideAction {
			return {
				type: "GUIDE_LESSON_ADD",
				title,
				editorState
			}
		},
		deleteLesson(lesson_id: string): IGuideAction {
			return {
				type: "GUIDE_LESSON_DELETE",
				lesson_id
			}
		},
		reoderLessons(order: string[]): IGuideAction {
			return {
				type: "GUIDE_LESSONS_REORDER",
				order
			}
		},
		editLesson(lesson_id: string, data: {title?: string, editorState?: string}): IGuideAction {
			return {
				type: "GUIDE_LESSON_MODIFY",
				lesson_id,
				data
			}
		}
	}
};