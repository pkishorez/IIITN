import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_Task: IJSONSchema = {
	type: "object",
	properties: {
		question: {
			type: "string"
		},
		resetCode: {
			type: "string"
		}
	}
};