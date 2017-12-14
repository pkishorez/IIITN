import {v4} from 'uuid';
import { IOrderedMap, IOrderedMapAction, OrderedMap } from 'classui/DataStructures/OrderedMap';

export type IGuide = IOrderedMap<IModule>;

export interface IModule {
	title: string
	editorState: string
}
export type IGuideAction = {
	type: "GUIDE_ACTION"
	orderedMapAction: IOrderedMapAction<IModule>
}

export type IGuideState = IOrderedMap<IModule>;

export let GuideReducer = (state: IGuideState = {map: {}, order: []}, action: IGuideAction)=>{
	switch(action.type) {
		case "GUIDE_ACTION": {
			console.log("BEFORE STATE", state);
			let orderedMapState = new OrderedMap(state);
			console.log("ACTION : ", action);
			orderedMapState.performAction(action.orderedMapAction);
			state = orderedMapState.getState();
			console.log("AFTER STATE", state);
			break;
		}
	}
	return state;
}