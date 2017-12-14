import {IGuideState, IGuide, IGuideAction, IModule} from 'App/State/Reducers/GuideReducer';
import {OrderedMap} from 'classui/DataStructures/OrderedMap';
import {KeyValue} from './_KeyValue';
import * as mongodb from 'mongodb';
import { OrderedMapDatabase } from 'Server/Database/Utils/OrderedMapDatabase';
import { Database } from 'Server/Database';

class _Guide{
	private orderedMapDatabase: OrderedMapDatabase<IModule>;

	// Update task. One action should be there.
	performAction(action: IGuideAction) {
		if (!this.orderedMapDatabase) {
			this.orderedMapDatabase = new OrderedMapDatabase<IModule>(Database.collection("guides"));
		}
		return this.orderedMapDatabase.performAction(action.orderedMapAction).then((omAction)=>{
			action.orderedMapAction = omAction;
			return action;
		}).catch((error)=>{
			return Promise.reject("Couldn't perform action.");
		});
	}
}

export let Guide = new _Guide();