import {v4} from 'uuid';
import * as _ from 'lodash';
import {Schema, IJSONSchema} from 'classui/Components/Form/Schema';
import {Collection} from '../index';
import {IOrderedMapAction, IOrderedMap} from 'classui/DataStructures/OrderedMap';
import { Promise } from 'es6-promise';

export class OrderedMapDatabase<T> {
	private collection: Collection;
	private order: string[];
	private Tschema: IJSONSchema;
	constructor(collection: Collection, schema: IJSONSchema = {}) {
		this.collection = collection;
		this.collection.get({_id: "config"}).then((config)=>{
			this.order = config.order;
		}).catch(console.error);
		this.Tschema = schema;
	}

	performAction(action: IOrderedMapAction<T>): Promise<any> {
		switch(action.type) {
			case "INIT": {
				let data: IOrderedMap<T>;
				return this.collection.getMany({}).toObject().then((list)=>{
					action.state = {
						map: _.omit(list, "config"),
						order: list.config?list.config.order?list.config.order:[]:Object.keys(list),
						hidden: list.config?list.config.hidden:undefined
					};
					return action;
				});
			}
			case "ADD": {
				let new_id = v4();
				let data: any = action.value;
				data._id = new_id;
				return this.collection.insert(data, this.Tschema).then(()=>{
					return this.collection.update("config", {
						$push: {'order': new_id}
					}).then(()=>{
						action._id = new_id;
						return action;	
					})
				});
			}
			case "DELETE": {
				if (!this.order) {
					return Promise.reject("COULDN'T GET ORDER!!!");
				}
				return this.collection.deleteById(action._id).then(()=>{
					let order = this.order.filter((id: string)=>{
						return action._id!=id;
					});
					return this.setOrder(order).then(()=>{
						return action;
					})
				});
			}
			case "MODIFY": {
				return this.collection.update(action._id, action.value, this.Tschema).then(()=>{
					return action;
				});
			}
			case "REORDER": {
				return this.setOrder(action.order).then(()=>{
					return action;
				});
			}
			case "HIDDEN": {
				return this.collection.deep("config", "hidden").update(action.hidden).then(()=>{
					return action;
				});
			}
		}
		console.error("UNKNOWN OPERATION : ", action);
		return Promise.reject("Unknown Operation ERROR.");
	}

	private setOrder(order: string[]) {
		return this.collection.update("config", {
			order
		}, undefined, true).then(()=>{
			this.order = order;
		}).catch(()=>{
			console.error("Couldn't update order.");
			return Promise.reject("Couldn't update order.");
		});
	}
}