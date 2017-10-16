import {combineReducers} from 'redux';
import {UserReducer, IUserState} from './UserReducer';

export interface IRootState {
	user: IUserState
}

export let RootReducer = combineReducers<IRootState>({
	user: UserReducer
});