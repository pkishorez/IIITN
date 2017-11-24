import {Collection} from 'Server/Database';
import {S_Task} from '../Schema/index';

let KeyValueDB: Collection = new Collection("keyvalue");

type IKeyValueDBS = "TASKS_DB"

export class KeyValue{
	// Update task. One action should be there.
	static set(key: IKeyValueDBS, data: any) {
		return KeyValueDB.raw.update({_id: key}, {
			data
		}, {
			upsert: true
		});
	}
	static get(key: IKeyValueDBS) {
		return KeyValueDB.findOne({_id: key})
	}
}