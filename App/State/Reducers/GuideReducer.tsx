import {v4} from 'uuid';
export interface ILessons {
	lessons: {
		[id: string]: ILesson
	}
	order: string[]
}
export interface ILesson {
	title: string
	editorState: string
}
export interface IGuideAction {
	type: "GUIDE_INIT" | "GUIDE_LESSON_ADD" | "GUIDE_LESSON_MODIFY" | "GUIDE_LESSON_DELETE" | "GUIDE_LESSONS_REORDER"
	[id: string]: any
}
let LessonReducer = (state: ILessons = {lessons: {},order: []}, action: IGuideAction) => {
	switch(action.type) {
		case "GUIDE_INIT": {
			state = {...action.state};
			break;
		}
		case "GUIDE_LESSON_ADD": {
			let lesson: ILesson = {
				title: action.title,
				editorState: action.editorState
			};
			let lesson_id = v4();
			state = {
				...state,
				lessons: {
					...state.lessons,
					[lesson_id]: lesson					
				},
				order: [
					...state.order,
					lesson_id
				]
			};
			break;
		}
		case "GUIDE_LESSON_MODIFY": {
			let lesson = state.lessons[action.lesson_id];
			if (lesson) {
				state = {
					...state,
					lessons: {
						...state.lessons,
						[action.lesson_id]: {
							...state.lessons[action.lesson_id],
							...action.data
						}
					}
				}
			}
			break;
		}
		case "GUIDE_LESSONS_REORDER": {
			state = {
				...state,
				order: action.order
			}
			break;
		}
		case "GUIDE_LESSON_DELETE": {
			delete state.lessons[action.lesson_id];
			state = {
				...state,
				order: state.order.splice(state.order.indexOf(action.lesson_id), 1)
			}
			break;
		}
	}
	return state;
}

export interface IGuideState {
	[id: string]: ILessons
}

export let GuideReducer = (state: IGuideState = {
	STARTER: {lessons: {}, order: []}
}, action: any)=>{
	state = {
		...state,
		[action.guide_id]: LessonReducer(state[action.guide_id], action)
	};
	return state;
}