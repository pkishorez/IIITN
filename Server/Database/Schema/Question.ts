import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_Question: IJSONSchema = {
	type: "object",
	properties: {
		title: {
			type: "string"
		},
		description: {
			type: "string"
		}	
	}
}