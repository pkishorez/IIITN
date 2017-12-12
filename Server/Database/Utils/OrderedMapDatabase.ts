import {v4} from 'uuid';
import * as _ from 'lodash';
import {Schema, IJSONSchema} from 'classui/Components/Form/Schema';
import {Collection} from '../index';
import {IOrderedMapAction, IOrderedMap} from 'classui/DataStructures/OrderedMap';
import { Promise } from 'es6-promise';

export class OrderedMapDatabase<T> {
	private collection: Collection;
	private Tschema: IJSONSchema;
	constructor(collection: Collection, schema: IJSONSchema = {}) {
		this.collection = collection;
		this.Tschema = schema;
	}

	performAction(action: IOrderedMapAction<T>): Promise<any> {
		return new Promise((resolve, reject)=>{
			switch(action.type) {
				case "INIT": {
					let data: IOrderedMap<T>;
					return resolve(this.collection.getMany({}).toObject().then((d)=>{
						let order = _.clone(d?d.order:[]);
						delete d.order;
						action.state = {
							map: d,
							order: order?order.order:[]
						};
						return action;
					}));
				}
				case "ADD": {
					let new_id = v4();
					let data: any = action.value;
					data._id = new_id;
					return resolve(this.collection.insert(data, this.Tschema).then(()=>{
						return this.collection.update("order", {
							$push: {'order': new_id}
						}).then(()=>{
							action._id = new_id;
							return action;	
						})
					}));
				}
				case "DELETE": {
					return resolve(this.collection.deleteById(action._id).then(()=>{
						return action;
					}));
				}
				case "MODIFY": {
					return resolve(this.collection.update(action._id, action.value, this.Tschema).then(()=>{
						return action;
					}));
				}
				case "REORDER": {
					return resolve(this.collection.update("order", {
						order: action.order
					}, undefined, true).then(()=>{
						return action;
					}));
				}
			}
			return reject("UNKNOWN ERROR.");
		})
	}
}