import {combineReducers} from 'redux';
import {UserReducer, IUserState, TaskReducer, ITaskState, GuideReducer, IGuideState} from './Reducers';
import {SessionReducer,ISessionState} from './Reducers/SessionReducer';
import {Network} from 'App/Network';

export interface IRootState {
	user: IUserState
	tasks: ITaskState
	guides: IGuideState
	session: ISessionState
}

let AppReducer = combineReducers<IRootState>({
	user: UserReducer,
	tasks: TaskReducer as any,
	guides: GuideReducer as any,
	session: SessionReducer as any
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