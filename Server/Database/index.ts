import * as mongodb from 'mongodb';
import { IJSONSchema } from 'classui/Components/Form/Schema/JSONSchema';
import { Schema } from 'classui/Components/Form/Schema';
import * as _ from 'lodash';

class Database {
	static get DB() {
		return new Promise<mongodb.Db>((resolve, reject)=>{
			mongodb.connect("mongodb://127.0.0.1:27017", (err, res)=>{
				if (!err && res) {
					resolve(res.db("iiitn"));					
				}
				reject("Couldn't connect to database.");
			})
			setTimeout(()=>{
				reject("Connection to database timedout.");
			}, 5000);
		})
	}
}

export class Collection{
	private _collection: mongodb.Collection;
	constructor(collection: string) {
		this.findOne = this.findOne.bind(this);
		this.getMany = this.getMany.bind(this);
		this.update = this.update.bind(this);
		this.insert = this.insert.bind(this);
		this.init = this.init.bind(this);

		this.init(collection);
	}
	async init(collection: string) {
		try {
			let db = await Database.DB;
			this._collection = db.collection(collection);
		}
		catch (e) {
			console.error("Couldn't connect to database.");
			process.exit();
		}
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
	async update(_id: string, data: any, schema?: IJSONSchema, upsert?: boolean) {
		if (schema) {
			let error = Schema.validate(schema, data);
			if (error) {
				return Promise.reject(error);
			}
		}
		try {
			return await this._collection.updateOne({_id}, data, {
				upsert
			}).catch(()=>{
				return Promise.reject("Coudln't update record.");
			});
		}
		catch(e) {
			throw e;
		}
	}
	async insert(data: any, schema?: IJSONSchema) {
		if (schema) {
			let error = Schema.validate(schema, data);
			if (error) {
				return Promise.reject(error);
			}
		}
		try {
			return await this._collection.insertOne(data).catch(()=>{
				return Promise.reject("Couldn't insert record");
			});
		}
		catch(e) {
			throw e;
		}
	}
	async deleteById(_id: string) {
		return await this._collection.deleteOne({_id}).catch(()=>{
			return Promise.reject("Couldn't delete record.");
		});
	}
	async findOne(criteria: any, fields?: Object) {
		return await this._collection.findOne(criteria, {fields}).catch(()=>{
			return Promise.reject("Couldn't find Record.");
		});
	}
	getMany(criteria: any, fields?: Object) {
		return this.__map(this._collection.find(criteria, fields))
	}
}