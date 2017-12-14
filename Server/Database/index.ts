import * as mongodb from 'mongodb';
import { IJSONSchema } from 'classui/Components/Form/Schema/JSONSchema';
import { Schema } from 'classui/Components/Form/Schema';
import * as _ from 'lodash';

type IValidCollections = "guides" | "tasks" | "user" | "keyvalue";

let DBConnection: mongodb.Db;

class Database_ {
	private _collections: any = {};
	constructor() {
		new Promise<mongodb.Db>((resolve, reject)=>{
			mongodb.connect("mongodb://127.0.0.1:27017", (err, res)=>{
				if (!err && res) {
					DBConnection = res.db("iiitn");
					Database._collections = {
						"guides": new Collection("guides"),
						"tasks": new Collection("tasks"),
						"user": new Collection("user"),
						"keyvalue": new Collection("keyvalue")
					};
					return resolve(DBConnection);
				}
				return reject("Couldn't connect to database.");
			})
			setTimeout(()=>{
				reject("Connection to database timedout.");
			}, 5000);
		})
	}
	collection(collection: IValidCollections): Collection {
		if (!Database._collections[collection]) {
			console.error("Couldn't Access Database. For collection ", collection);
			process.exit();
		}
		return Database._collections[collection];
	}
}
export let Database = new Database_();

export class Collection{
	private _collection: mongodb.Collection;
	constructor(collection: IValidCollections) {
		this.findOne = this.findOne.bind(this);
		this.getMany = this.getMany.bind(this);
		this.update = this.update.bind(this);
		this.insert = this.insert.bind(this);

		if (!DBConnection) {
			console.error("Couldn't establish database connection : ", collection);
			process.exit();
		}
		this._collection = DBConnection.collection(collection);
	}

	Get(collection: IValidCollections) {
		return Database.collection(collection);
	}

	get raw() {
		return this._collection;
	}

	private __map(res: mongodb.Cursor) {
		return {
			toArray() {
				return res.toArray().catch(()=>{
					return Promise.reject("Couldn't get records.");
				});
			},
			toObject() {
				let json: any = {};
				return res.toArray().then(arr=>{
					arr.map((elem)=>{
						json[elem._id] = elem;
					});
					return json;
				}).catch(()=>{
					return Promise.reject("Couldn't get records");
				})
			}
		}
	}
	update(_id: string, data: any, schema?: IJSONSchema, upsert?: boolean) {
		if (!this._collection) {
			return Promise.reject("Couldn't get handle to collection.");
		}
		if (schema) {
			let error = Schema.validate(schema, data);
			if (error) {
				return Promise.reject(error);
			}
		}
		return this._collection.updateOne({_id}, data, {
			upsert
		}).catch(()=>{
			return Promise.reject("Coudln't update record.");
		});
	}
	insert(data: any, schema?: IJSONSchema) {
		if (!this._collection) {
			return Promise.reject("Couldn't get handle to collection.");
		}
		if (schema) {
			let error = Schema.validate(schema, data);
			if (error) {
				return Promise.reject(error);
			}
		}
		try {
			return this._collection.insertOne(data).catch(()=>{
				return Promise.reject("Couldn't insert record");
			});
		}
		catch(e) {
			throw e;
		}
	}
	deleteById(_id: string) {
		if (!this._collection) {
			return Promise.reject("Couldn't get handle to collection.");
		}
		return this._collection.deleteOne({_id}).catch(()=>{
			return Promise.reject("Couldn't delete record.");
		});
	}
	findOne(criteria: any, fields?: Object) {
		if (!this._collection) {
			return Promise.reject("Couldn't get handle to collection.");
		}
		return this._collection.findOne(criteria, {fields}).catch(()=>{
			return Promise.reject("Couldn't find Record.");
		});
	}
	getMany(criteria: any, fields?: Object) {
		return this.__map(this._collection.find(criteria, fields))
	}
}