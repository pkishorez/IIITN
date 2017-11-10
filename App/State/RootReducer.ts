import {combineReducers} from 'redux';
import {UserReducer, IUserState, TaskReducer, ITaskState} from './Reducers';
import {Network} from '../Network';

export interface IRootState {
	user: IUserState
	tasks: ITaskState
}

let AppReducer = combineReducers<IRootState>({
	user: UserReducer,
	tasks: TaskReducer
});

export let RootReducer = (state: IRootState|undefined, action: any)=>{
	if (action.type=="USER_LOGOUT") {
		state = undefined;
		state = AppReducer(state as any, action) as IRootState;
		state.user = {
			...state.user,
			online: Network.onlineStatus
		};
		return state;
	}
	return AppReducer(state as any, action);
}