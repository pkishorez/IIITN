import {IGuideState, IGuide, IGuideAction} from 'App/State/Reducers/GuideReducer';
import {OrderedMap} from 'classui/DataStructures/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';

class _Guide{
	private guideState: IGuideState

	// Update task. One action should be there.
	__init() {
		return KeyValue.get("GUIDE_DB").then((data)=>{
			if (!data) {
				data = {};
			}
			return data;
		});
	}
	performAction(type: IGuideAction["type"], action: IGuideAction) {
		action.type = type;
		return new Promise<IGuideAction>(async (resolve, reject)=>{
			if (!this.guideState) {
				this.guideState = await this.__init()
			}
			switch(action.type) {
				case "GUIDE_INIT": {
					action.state = this.guideState;
					break;
				}
				case "GUIDE_MODULE_ACTION": {
					if (!action.guide_id) {
						return reject("Guide id should be provided.");
					}
					let guide = new OrderedMap(this.guideState[action.guide_id]);
					action.orderedMapAction = guide.performAction(action.orderedMapAction);
					this.guideState[action.guide_id] = guide.getState();
					KeyValue.set("GUIDE_DB", this.guideState);
					break;
				}
			}
			resolve(action);
		}).catch(console.error);
	}
}

export let Guide = new _Guide();