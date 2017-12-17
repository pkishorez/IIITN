import {IJSONSchema} from 'classui/Components/Form/Schema';
import { IFunctionDetails } from 'App/Monaco/Runtime/Tasks';

export let S_FunctionDetails: IJSONSchema = {
	type: "object",
	properties: {
		name: {
			type: "string"
		},
		tests: {
			type: "array",
			items: {
				type: "object",
				properties: {
					input: {
						type: "array"
					},
					output: {}
				},
				required: ["input", "output"]
			}
		}
	},
	required: ["name", "tests"]
};


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
		}, {
			type: "object",
			properties: {
				type: {
					const: "TYPESCRIPT_TESTCASE_TASK"
				},
				title: {
					type: "string"
				},
				question: {
					type: "string"
				},
				resetCode: {
					type: "string"
				},
				funcDetails: S_FunctionDetails
			},
			required: ["type", "title", "question", "resetCode", "funcDetails"]
		}
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
export type ITypescriptTestCaseTask = {
	type: "TYPESCRIPT_TESTCASE_TASK"
	title: string
	question: string
	funcDetails: IFunctionDetails
	resetCode: string
}

export type ITask = ICanvasTask | ITypescriptTask | ITypescriptTestCaseTask;

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
		},
		{
			type: "object",
			properties: {
				_id: validIDSchema,
				type: {
					const: "TYPESCRIPT_TESTCASE_TASK"
				},
				code: {
					type: "string"
				},
				test_cases_passed: {
					type: "number"
				}
			},
			required: ["type", "code", "test_cases_passed"]
		}
		// Other type of tasks can be implemented here.
	]
}

export type ITypescriptTestCaseTask_Submission = {
	_id: string
	type: "TYPESCRIPT_TESTCASE_TASK"
	code: string
	test_cases_passed: number
};

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
} | ITypescriptTestCaseTask_Submission;