import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_Task: IJSONSchema = {
	type: "object",
	properties: {
		_id: {
			type: "string"
		},
		question: {
			type: "string"
		},
		resetCode: {
			type: "string"
		}
	}
};