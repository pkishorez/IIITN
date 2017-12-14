import {Database} from 'Server/Database';
import {S_Task} from '../Schema/index';

type IKeyValueDBS = "TASKS_DB" | "GUIDE_DB" | "POLL_DB"

export class KeyValue{
	// Update task. One action should be there.
	static set(key: IKeyValueDBS, data: any) {
		return Database.collection("keyvalue").raw.update({_id: key}, {
			data
		}, {
			upsert: true
		});
	}
	static get(key: IKeyValueDBS) {
		return Database.collection("keyvalue").findOne({_id: key}).then((data)=>{
			if (data) {
				return data.data;
			}
			return null;
		});
	}
}