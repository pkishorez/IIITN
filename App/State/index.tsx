import {RootReducer, IRootState} from './RootReducer';
import {createStore, Store} from 'redux';
import * as _ from 'lodash';
export {IRootState} from './RootReducer';
export {connect} from 'react-redux';
export {IUserAction, IUserActionType, IUserState} from './Reducers/UserReducer';
export let __store: Store<IRootState>;

let EnableReduxDebugging = (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

try {
	let preLoadedState: IRootState = JSON.parse(localStorage.getItem("state") as string);
	// Reset preloaded state independent of state saved.
	preLoadedState.user.online = false;
	__store = createStore<IRootState>(RootReducer, preLoadedState, EnableReduxDebugging);
}
catch(e) {
	__store = createStore<IRootState>(RootReducer, EnableReduxDebugging);
}

let persistState = ()=>{
	localStorage.setItem("state", JSON.stringify(__store.getState()));
};

__store.subscribe(_.debounce(persistState, 1000, {
	leading: true,
	trailing: true
}));

export let GetState = __store.getState;