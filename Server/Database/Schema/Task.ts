import {IJSONSchema} from 'classui/Components/Form/Schema';

export let S_Task: IJSONSchema = {
	oneOf: [
		{
			type: "object",
			properties: {
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
		}, {
			type: "object",
			properties: {
				type: {
					const: "TYPESCRIPT_EXPOUTPUT"
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
			required: ["type", "title", "question"]
		}
		// Other type of tasks not implemented yet.
	]
};

export type ICanvasTask = {
	type: "CANVAS2D"
	title: string
	question: string
	resetCode: string
}
export type ITypescriptTask = {
	type: "TYPESCRIPT_EXPOUTPUT"
	title: string
	question: string
	expectedOutput: string
	resetCode?: string
}

export type ITask = ICanvasTask | ITypescriptTask;

let validIDSchema: IJSONSchema = {
	type: "string",
	pattern: "^[a-zA-Z0-9-]{1,50}$"
}
export let S_UserTask_Details: IJSONSchema = {
	oneOf: [
		{
			type: "object",
			properties: {
				_id: validIDSchema,
				type: {
					const: "CANVAS2D"
				},
				code: {
					type: "string"
				},
				result: {
					enum: ["PENDING", "WRONG", "CAN_BE_IMPROVED", "GOOD", "PIXEL_PERFECT"]
				},
				comments: {
					type: "string"
				}
			},
			required: ["type", "code", "result"]
		},
		{
			type: "object",
			properties: {
				_id: validIDSchema,
				type: {
					const: "TYPESCRIPT_EXPOUTPUT"
				},
				code: {
					type: "string"
				},
				result: {
					enum: ["PENDING", "WRONG", "RIGHT"]
				}
			},
			required: ["type", "code", "result"]
		}
		// Other type of tasks can be implemented here.
	]
}

export type IUserTask_Details = {
	_id: string
	type: "CANVAS2D"
	code: string
	result: "PENDING" | "WRONG" | "CAN_BE_IMPROVED" | "GOOD" | "PIXEL_PERFECT"
	comments?: string
} | {
	_id: string
	type: "TYPESCRIPT_EXPOUTPUT"
	code: string
	result: "PENDING" | "WRONG" | "RIGHT"
}