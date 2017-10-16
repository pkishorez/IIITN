import {RootReducer, IRootState} from './RootReducer';
import {createStore, Store} from 'redux';
import * as _ from 'lodash';

export let store: Store<IRootState>;

try {
	let preLoadedState: IRootState = JSON.parse(localStorage.getItem("state") as string);
	store = createStore<IRootState>(RootReducer, preLoadedState);
}
catch(e) {
	store = createStore<IRootState>(RootReducer);
}

let persistState = ()=>{
	localStorage.setItem("state", JSON.stringify(store.getState()));
};

store.subscribe(_.debounce(persistState, 2000, {
	leading: true,
	trailing: true
}));