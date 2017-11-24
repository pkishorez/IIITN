import {v4} from 'uuid';
import * as _ from 'lodash';

export interface IOrderedMap<T>{
	map: {
		[id: string]: T
	},
	order: string[]
}

export type IOrderedMapAction<T> = {
	type: "ADD"
	value: T
} | {
	type: "MODIFY"
	id: string
	value: T
} | {
	type: "DELETE"
	id: string
} | {
	type: "REORDER"
	order: string[]
};

export class OrderedMap<T> {
	private orderedMap: IOrderedMap<T>;
	constructor(orderedMap: IOrderedMap<T> = {map: {}, order: []}) {
		this.orderedMap = orderedMap;
		// Integrity check to make sure all keys in map are present in order.
		let mapKeys = Object.keys(this.orderedMap.map).sort();
		let order = this.orderedMap.order.sort();

		if (_.isEqual(mapKeys, order)) {
			// Good :)
		}
		else {
			console.error("SERIOUS ERROR : ORDERED MAP ERROR. KEYS IN ORDER AND MAPKEYS MISMATCH.");
		}
	}

	performAction(action: IOrderedMapAction<T>): IOrderedMap<T> {
		switch(action.type) {
			case "ADD": {
				return this.add(action.value);
			}
			case "DELETE": {
				return this.del(action.id);
			}
			case "MODIFY": {
				return this.modify(action.id, action.value);
			}
			case "REORDER": {
				return this.reorder(action.order);
			}
		}
		return this.orderedMap;
	}

	getState() {
		return this.orderedMap;
	}

	toString() {
		return JSON.stringify(this.orderedMap);
	}

	add(value: T): IOrderedMap<T> {
		let uid = v4();

		this.orderedMap = {
			...this.orderedMap,
			map: {
				...this.orderedMap.map,
				[uid]: value
			},
			order: [
				...this.orderedMap.order,
				uid
			]
		};
		return this.orderedMap;
	}

	del(map_id: string): IOrderedMap<T> {
		let filtered = this.orderedMap.order.filter(id=>map_id!=id);
		this.orderedMap = {
			...this.orderedMap,
			map: _.pick(this.orderedMap.map as any, filtered),
			order: filtered
		}
		return this.orderedMap;
	}

	modify(map_id: string, value: T): IOrderedMap<T> {
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