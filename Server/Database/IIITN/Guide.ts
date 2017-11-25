import {IGuideState, IGuide, IGuideAction} from 'App/State/Reducers/GuideReducer';
import {OrderedMap} from 'Utils/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';

class _Guide{
	private guideMap: IGuideState

	// Update task. One action should be there.
	constructor() {
		setTimeout(()=>{
			KeyValue.get("GUIDE_DB").then((data)=>{
				this.guideMap = data;
			}).catch(console.error);
		}, 5000)
	}
	performAction(action: IGuideAction) {
		return new Promise<IGuideAction>((resolve, reject)=>{
			if (!this.guideMap) {
				reject("Database Error. Couldn't perform task.");
			}
			switch(action.type) {
				case "GUIDE_INIT": {
					action.state = this.guideMap;
					break;
				}
				case "GUIDE_MODULE_ACTION": {
					let guide = this.guideMap[action.guide_id];
					let oMap = new OrderedMap(guide);
					action.orderedMapAction = oMap.performAction(action.orderedMapAction);
					break;
				}
			}
			resolve(action);
		}).catch(console.error);
	}
}

export let Guide = new _Guide();