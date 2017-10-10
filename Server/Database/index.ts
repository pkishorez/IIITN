import * as mongodb from 'mongodb';
import {Promise} from 'es6-promise';

let db: mongodb.Db;
export let DB = new Promise<mongodb.Db>((resolve, reject)=>{
	if (db){
		resolve(db);		
	}
	mongodb.connect("mongodb://127.0.0.1:27017", (err, res)=>{
		if (err) {
			reject(new Error("Couldn't connect to database."));
			return;
		}
		db = res.db("iiitn");
		resolve(db);
	});
});