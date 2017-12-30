import * as _ from 'lodash';
import { train } from 'App/Utils/Audio';

export type ISessionAction = {
	type: "SESSION_ADD_STUDENTS"
	students: string[]
} | {
	type: "SESSION_DEL_STUDENTS",
	students: string[]
} | {
	type: "SESSION_INIT",
	list: string[]
	sitting: ISessionState["sitting"]
} | {
	type: "SESSION_SITTING",
	sitting: ISessionState["sitting"]
} | {
	type: "SESSION_POMPOMMMM"
} | {
	type: "SESSION_POMPOMMMM_ALL"
}

export type ISessionState = {
	students: string[],
	sitting: {
		[id: string]: string
	}
}
let defaultState: ISessionState = {
	students: [],
	sitting: {}
};

export let SessionReducer = (state: ISessionState=defaultState, action: ISessionAction) => {
	switch(action.type) {
		case "SESSION_INIT": {
			state = {
				...state,
				students: [...action.list],
				sitting: {...action.sitting}
			};
			break;
		}
		case "SESSION_ADD_STUDENTS": {
			state = {
				...state,
				students: [
					...state.students,
					...action.students
				]
			};
			break;
		}
		case "SESSION_DEL_STUDENTS": {
			state = {
				...state,
				students: _.difference(state.students, action.students)
			};
			break;
		}
		case "SESSION_SITTING": {
			state = {
				...state,
				sitting: action.sitting
			};
			break;
		}
		case "SESSION_POMPOMMMM": {
			train.play();
		}
		case "SESSION_POMPOMMMM_ALL": {
			train.play();
		}
	}
	return state;
}