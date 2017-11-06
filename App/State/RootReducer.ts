import {combineReducers} from 'redux';
import {UserReducer, IUserState} from './UserReducer';
import {TaskReducer, ITaskState} from './TaskReducer';

export interface IRootState {
	user: IUserState
	tasks: ITaskState
}

export let RootReducer = combineReducers<IRootState>({
	user: UserReducer,
	tasks: TaskReducer
});