import * as mongodb from 'mongodb';
import { IJSONSchema } from 'classui/Components/Form/Schema/JSONSchema';
import { Schema } from 'classui/Components/Form/Schema';
import * as _ from 'lodash';

type IValidCollections = "guides" | "tasks" | "user" | "keyvalue";

let DBConnection: mongodb.Db;

class Database_ {
	private _collections: {[id: string]: Collection} = {};
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
	private _collection: mongodb.Collection | undefined;
	constructor(collection: IValidCollections) {
		this.get = this.get.bind(this);
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

	/*
	get raw() {
		return this._collection;
	}*/

	deep(_id: string, key: string) {
		let operation = (op: any)=>{
			if (!this._collection) return Promise.reject("Couldn't get handle to collection");
			return this._collection.updateOne({_id}, operation);
		}
		return {
			update: (value: any)=> {
				return operation({
					$set: {
						[key]: value
					}
				}).catch(()=>Promise.reject("Couldn't update record."));
			},
			appendSet: (values: any[])=>{
				return operation({
					$addToSet: {
						[key]: {
							$each: values
						}
					}
				}).catch(()=>Promise.reject("Couldn't append elements to array"));
			},
			removeFromSet: (values: any[])=>{
				return operation({
					$pull: {
						[key]: {
							$in: values
						}
					}
				});
			}
		}
	}

	private __map(criteria: any, fields?: any) {
		return {
			toArray: () => {
				if (!this._collection) return Promise.reject("Couldn't get handle to collection");

				let res = this._collection.find(criteria, fields);		
				return res.toArray().catch(()=>{
					return Promise.reject("Couldn't get records.");
				});
			},
			toObject: ()=> {
				if (!this._collection) return Promise.reject("Couldn't get handle to collection");

				let res = this._collection.find(criteria, fields);
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
	get(criteria: any, fields?: Object) {
		if (!this._collection) {
			return Promise.reject("Couldn't get handle to collection.");
		}
		return this._collection.findOne(criteria, {
			fields
		}).then((data)=>{
			if (!data) {
				return Promise.reject("Couldn't find Record.");
			}
			return data;
		}).catch(()=>Promise.reject("Error finding Record."));
	}
	getMany(criteria: any, fields?: Object) {
		return this.__map(criteria, fields);
	}
}