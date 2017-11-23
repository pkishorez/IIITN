import {combineReducers} from 'redux';
import {UserReducer, IUserState, TaskReducer, ITaskState, GuideReducer, IGuideState} from './Reducers';
import {Network} from 'App/Network';

export interface IRootState {
	user: IUserState
	tasks: ITaskState
	guides: IGuideState
}

let AppReducer = combineReducers<IRootState>({
	user: UserReducer,
	tasks: TaskReducer,
	guides: GuideReducer
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