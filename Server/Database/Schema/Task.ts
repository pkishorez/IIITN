import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_Task: IJSONSchema = {
	oneOf: [
		{
			type: "object",
			properties: {
				_id: {
					type: "string"
				},
				type: {
					const: "CANVAS2D"
				},
				title: {
					type: "string"
				},
				question: {
					type: "string"
				},
				resetCode: {
					type: "string"
				}
			},
			required: ["type", "title", "question", "resetCode"]
		}
		// Other type of tasks not implemented yet.
	]
};

export type ITask = {
	_id?: string
	type: "CANVAS2D"
	title: string
	question: string
	resetCode: string
}