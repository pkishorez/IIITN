import {Collection} from 'Server/Database';
import {S_Task} from '../Schema/index';
import {INR_Task} from 'Common/ActionSignature';

export let KeyValueDB: Collection = new Collection("keyvalue");

export class KeyValue{
	// Update task. One action should be there.
	static set(key: string, data: any) {
		return KeyValueDB.raw.update({_id: key}, data, {
			upsert: true
		});
	}
	static get(key: string) {
		return KeyValueDB.findOne({_id: key})
	}
}