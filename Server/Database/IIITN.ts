import {DB} from './';
import {ISchema, ValidateSchema} from 'classui/Components/Form/Schema';
import {SRegisterUser} from './Schema';
import {Promise} from 'es6-promise';
import * as mongodb from 'mongodb';

let REJECT = (error: string)=>{
	return ()=>{
		return Promise.reject(error);
	}
}
export class User {
	userid: string;

	private constructor(userid: string) {
		this.userid = userid;
	}
	static get db(){
		return DB.then<mongodb.Db>(db=>Promise.resolve(db), REJECT("Failed to connect database."));
	}
	get db() {
		return User.db;
	}
	static register(user: any) {
		let error = ValidateSchema(SRegisterUser, user);
		if (error){
			return Promise.reject(error);
		}
		return this.db.then((db)=>{
			return db.collection("user").insertOne(user).then((res)=>{
				return Promise.resolve(`User ${user._id} successfully registered.`);
			}).catch(REJECT("User Already Exist."));
		});
	}
	static login(userid: string, password: string) {
		return this.db.then((db)=>{
			return db.collection("user").findOne({_id: userid}).then((res)=>{
				// User Found.
				if (res.password!=password) {
					return Promise.reject("Invalid password.");
				}
				return Promise.resolve(userid);
			});
		});
	}

}