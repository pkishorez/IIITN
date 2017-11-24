import {v4} from 'uuid';
import * as _ from 'lodash';

export interface IOrderedMap<T>{
	map: {
		[id: string]: T
	},
	order: string[]
}

export type IOrderedMapAction<T> = {
	type: "INIT"
	state: IOrderedMap<T>
} | {
	type: "ADD"
	_id?: string
	value: T
} | {
	type: "MODIFY"
	_id: string
	value: Partial<T>
} | {
	type: "DELETE"
	_id: string
} | {
	type: "REORDER"
	order: string[]
};

export class OrderedMap<T> {
	private orderedMap: IOrderedMap<T>;
	constructor(orderedMap: IOrderedMap<T>) {
		if (!orderedMap) {
			orderedMap = {map: {}, order: []};
		}
		this.orderedMap = this.init(orderedMap);
	}

	performAction(action: IOrderedMapAction<T>): IOrderedMapAction<T> {
		switch(action.type) {
			case "INIT": {
				this.orderedMap = this.init(action.state);
				break;
			}
			case "ADD": {
				let addedMap = this.add(action.value, action._id);
				if (addedMap!=this.orderedMap) {
					this.orderedMap = addedMap;
					action._id = this.orderedMap.order[this.orderedMap.order.length-1];
				}
				break;
			}
			case "DELETE": {
				this.orderedMap = this.del(action._id);
				break;
			}
			case "MODIFY": {
				this.orderedMap = this.modify(action._id, action.value);
				break;
			}
			case "REORDER": {
				this.orderedMap = this.reorder(action.order);
				break;
			}
		}
		return action;
	}

	getState() {
		return this.orderedMap;
	}

	toString() {
		return JSON.stringify(this.orderedMap);
	}

	init(orderedMap: IOrderedMap<T>): IOrderedMap<T> {
		// Integrity check to make sure all keys in map are present in order.
		let mapKeys = Object.keys(orderedMap.map).sort();
		let order = orderedMap.order.sort();

		if (_.isEqual(mapKeys, order)) {
			// INTEGRITY IS Good :)
			if (_.isEqual(orderedMap, this.orderedMap)) {
				// NO CHANGE.
				return this.orderedMap;
			}
			return orderedMap;
		}
		// Operation rejected. Integrity failure.
		return this.orderedMap;
	}

	add(value: T, _id = v4()): IOrderedMap<T> {

		if (this.orderedMap.map[_id]) {
			return this.orderedMap;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: {
				...this.orderedMap.map,
				[_id]: value
			},
			order: [
				...this.orderedMap.order,
				_id
			]
		};
		return this.orderedMap;
	}

	del(map_id: string): IOrderedMap<T> {
		let filtered = this.orderedMap.order.filter(id=>map_id!=id);
		if (_.isEqual(filtered, this.orderedMap.order)) {
			return this.orderedMap;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: _.pick(this.orderedMap.map as any, filtered),
			order: filtered
		}
		return this.orderedMap;
	}

	modify(map_id: string, value: Partial<T>): IOrderedMap<T> {
		if (this.orderedMap.map[map_id]) {
			this.orderedMap = {
				...this.orderedMap,
				map: {
					...this.orderedMap.map,
					[map_id]: {
						...this.orderedMap.map[map_id] as any,
						...value as any
					}
				}
			}
		}
		return this.orderedMap;
	}

	reorder(order: string[]): IOrderedMap<T> {
		if (_.isEqual(order.sort(), this.orderedMap.order.sort())) {
			this.orderedMap = {
				...this.orderedMap,
				order
			};
		}
		return this.orderedMap;
	}
}