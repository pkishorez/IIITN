import {combineReducers} from 'redux';
import {UserReducer, IUserState} from './UserReducer';
import {TaskReducer, ITaskState} from './TaskReducer';
import {SocketIO} from '../SocketIO';

export interface IRootState {
	user: IUserState
	tasks: ITaskState
}

let AppReducer = combineReducers<IRootState|undefined>({
	user: UserReducer,
	tasks: TaskReducer
});

export let RootReducer = (state: IRootState|undefined, action: any)=>{
	if (action.type=="USER_LOGOUT") {
		state = undefined;
		state = AppReducer(state, action) as IRootState;
		state.user = {
			...state.user,
			online: SocketIO.onlineStatus
		};
		return state;
	}
	return AppReducer(state as any, action);
}