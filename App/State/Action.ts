import {IUserAction} from './Reducers/UserReducer';
import {ITaskAction, ITaskState, ITask} from './Reducers/TaskReducer';
import {INR_User} from 'Common/ActionSignature';
import { IGuideAction, IGuideState } from './Reducers/GuideReducer';
import {__store} from 'App/State';

export let A_Guide = {
	INIT(state: IGuideState): IGuideAction {
		return {
			type: "GUIDE_INIT",
			state
		}
	},
}

export let D_Guide = (guide_id: "STARTER")=>{
	return {
		addLesson(title: string, editorState: string) {
			let action: IGuideAction = {
				type: "GUIDE_LESSON_ADD",
				guide_id,
				title,
				editorState
			};
			__store.dispatch(action);
		},
		deleteLesson(lesson_id: string) {
			let action: IGuideAction = {
				type: "GUIDE_LESSON_DELETE",
				guide_id,
				lesson_id
			};
			__store.dispatch(action);
		},
		reoderLessons(order: string[]) {
			let action: IGuideAction = {
				type: "GUIDE_LESSONS_REORDER",
				guide_id,
				order
			};
			__store.dispatch(action);
		},
		editLesson(lesson_id: string, data: {title?: string, editorState?: string}) {
			let action: IGuideAction = {
				type: "GUIDE_LESSON_MODIFY",
				guide_id,
				lesson_id,
				data
			};
			__store.dispatch(action);
		}
	}
};