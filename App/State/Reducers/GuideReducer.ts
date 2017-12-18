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
			let orderedMapState = new OrderedMap(state);
			orderedMapState.performAction(action.orderedMapAction);
			state = orderedMapState.getState();
			break;
		}
	}
	return state;
}