import {RootReducer, IRootState} from './RootReducer';
import {createStore} from 'redux';

export let store = createStore<IRootState>(RootReducer);