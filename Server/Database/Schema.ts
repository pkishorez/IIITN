import {ISchema} from 'classui/Components/Form/Schema';

export let SRegisterUser: ISchema = {
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

export let SLoginUser: ISchema = {
	_id: SRegisterUser._id,
	password: SRegisterUser.password
};