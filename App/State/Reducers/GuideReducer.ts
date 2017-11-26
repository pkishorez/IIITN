import {v4} from 'uuid';
import { IOrderedMap, IOrderedMapAction, OrderedMap } from 'classui/DataStructures/OrderedMap';

export type IGuide = IOrderedMap<IModule>;

export interface IModule {
	title: string
	editorState: string
}
export type IGuideAction = {
	type: "GUIDE_INIT"
	state: IGuideState
} | {
	type: "GUIDE_MODULE_ACTION"
	guide_id: "STARTER"
	orderedMapAction: IOrderedMapAction<IModule>
}

let ModuleReducer = (state: IGuide = {map: {},order: []}, action: IGuideAction) => {
	switch(action.type) {
		case "GUIDE_MODULE_ACTION": {
			let orderedMapState = new OrderedMap(state);
			orderedMapState.performAction(action.orderedMapAction);
			state = orderedMapState.getState();
			break;
		}
	}
	return state;
}

export interface IGuideState {
	[id: string]: IGuide
}

export let GuideReducer = (state: IGuideState = {
	"STARTER": {map: {}, order: []}
}, action: IGuideAction)=>{
	switch(action.type) {
		case "GUIDE_INIT": {
			state = {...action.state};
			break;
		}
		case "GUIDE_MODULE_ACTION": {
			state = {
				...state,
				[action.guide_id]: ModuleReducer(state[action.guide_id], action)
			};
			break;
		}
	}
	return state;
}