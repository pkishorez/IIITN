import {ISchema, ISchemaPopulate} from 'classui/Components/Form/Schema';

export let S_User: ISchema = {
	_id: {
		type: "string",
		length: 7
	},
	name: {
		type: "string"
	},
	email: {
		type: "email"
	},
	password: {
		type: "string",
		minLength: 5
	},
	batch: {
		type: "list",
		values: ["E1", "E2", "E3", "E4"]
	},
	branch: {
		type: "list",
		values: ["CSE", "MME", "ECE", "MECH", "CHEMICAL"]
	}
};

export let S_UserLogin: ISchema = {
	_id: S_User._id,
	password: S_User.password
};

export let SP_UserProfile: ISchemaPopulate = {
	schema: S_User,
	exclude: ["password"]
};