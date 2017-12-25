import {Database, Collection} from 'Server/Database';
import {S_Task} from '../Schema/index';

type IKeyValueDBS = "TASKS_DB" | "GUIDE_DB" | "POLL_DB"

export class KeyValue{
	// Update task. One action should be there.
	static set(key: IKeyValueDBS, data: any) {
		return Database.collection("keyvalue").update(key, {
			data
		}, undefined, true);
	}
	static get(key: IKeyValueDBS) {
		return Database.collection("keyvalue").get({_id: key}).then((data)=>{
			if (data) {
				return data.data;
			}
			return null;
		});
	}
}