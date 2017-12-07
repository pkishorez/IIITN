import {compileCode, runProgramInWorker} from '../';
import { IJSONSchema } from 'classui/Components/Form/Schema/JSONSchema';
// POST MESSAGE
let BUFFER_SIZE = 5;

let Code = {
	_before: `
		var __kishore_bdata = "";
		let _Console = console;
		let __kishore_logMessage = (args: any[])=>{
			let msg = "";
			for (let arg of args) {
				switch(typeof arg) {
					case "undefined":{
						msg += "undefined";
						break;
					}
					case "function": {
						msg += "[function]";
						break;
					}
					case "object": {
						msg += JSON.stringify(arg, null, 4)+"\\n";
						break;
					}
					case "symbol":
					case "boolean":
					case "string":
					case "number": {
						msg += arg.toString();
						break;
					}
				}
			}
			return msg;
		};
		(console as any) = {
			_log(args) {
				let msg = __kishore_logMessage(args);
				if ((__kishore_bdata.length+msg.length)>(${BUFFER_SIZE}*1024)) {
					//self.postMessage({type: "error", data: "Buffer Overflow. Output cannot exceed 5KB."});
					throw("Buffer Overflow. Output exceeded ${BUFFER_SIZE}KB.");
				}
				__kishore_bdata += msg;
			},
			log(...args) {
				this._log(args);
			}
		}`,
	_after: ``,
	generate(code: string) {
		// Transpile Typescript to Javascript.
		code = `
		${this._before}
		try {
			${code}
		}
		catch(e) {
			self.postMessage({type: "error", data: e});
		}
		${this._after}
		`;
		return compileCode(code);
	}
}

interface IFunctionInputOutput {
	input: any[],
	output: any
}

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
				}
			}
		}
	}
}
export interface IFunctionDetails {
	name: string
	tests: IFunctionInputOutput[]
	timeout?: number
};
export let Runtime = {
	run(code: string) {
		let genCode = Code.generate(`
			${code};
			self.postMessage({type: "OUTPUT", data: __kishore_bdata});
		`);
		return runProgramInWorker<string>(genCode);
	},
	runFunctionTestCases(code: string, func: IFunctionDetails) {
		let genCode = Code.generate(`
			${code};
			let func = ${JSON.stringify(func)};
			let inputs = func.tests;
			if (typeof ${func.name}=="function") {
				console = {
					log(msg){}
				}
				let outputs = [];
				for (let input of inputs) {
					let output = ${func.name}.apply(null, input.input);
					outputs.push(output);
				}
				self.postMessage({type: 'OUTPUT', data: {
					outputs,
					data: __kishore_bdata
				}});
			}
			else {
				self.postMessage({type: 'error', data: 'Function ${func.name} not defined.'});
			}
		`);
		return runProgramInWorker<{
			outputs: any[]
			data: string
		}>(genCode, func.timeout);
	}
};
