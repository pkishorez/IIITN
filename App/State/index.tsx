import {RootReducer, IRootState} from './RootReducer';
import {createStore, Store} from 'redux';
import * as _ from 'lodash';

export {A_User, A_Task} from './Action';
export {IRootState} from './RootReducer';
export {IUserAction, IUserActionType, IUserState} from './UserReducer';
export let store: Store<IRootState>;

try {
	let preLoadedState: IRootState = JSON.parse(localStorage.getItem("state") as string);
	// Reset preloaded state independent of state saved.
	preLoadedState.user.online = false;
	store = createStore<IRootState>(RootReducer, preLoadedState);
}
catch(e) {
	store = createStore<IRootState>(RootReducer);
}

let persistState = ()=>{
	localStorage.setItem("state", JSON.stringify(store.getState()));
};

store.subscribe(_.debounce(persistState, 1000, {
	leading: true,
	trailing: true
}));