import * as _ from 'lodash';
import {transpileModule} from './Playground';
import * as ts from 'typescript';

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
		return transpileModule(code, {
			module: ts.ModuleKind.AMD,
			target: ts.ScriptTarget.ES5,
			noLib: true,
			noResolve: true,
			suppressOutputPathCheck: true
		});
	}
}

export interface IFunctionInputOutput {
	input: any[],
	output: any
}
export interface IFunction {
	name: string
	inputs: IFunctionInputOutput[]
};
export let Runtime = {
	run(code: string) {
		let genCode = Code.generate(`
			${code};
			self.postMessage({type: "OUTPUT", data: __kishore_bdata});
		`);
		return runProgram(genCode);
	},
	runFunction(code: string, func: IFunction): Promise<{outputs: any, consoleOutput: string}> {
		let genCode = Code.generate(`
			${code};
			let func = ${JSON.stringify(func)};
			let inputs = func.inputs;
			if (${func.name}) {
				console = {
					log(msg){}
				}
				let outputs = [];
				for (let input of inputs) {
					let output = ${func.name}.apply(null, [input.input]);
					outputs.push(output);
				}
				self.postMessage({type: 'OUTPUT', data: {
					consoleOutput: __kishore_bdata,
					outputs
				}});
			}
			else {
				self.postMessage({type: 'error', data: 'Function ${func.name} not defined.'});
			}
		`);
		return runProgram(genCode, true) as any;
	}
};

interface IRuntimeResponse {
	type: "error" | "OUTPUT",
	data: any
};
let globalWorker: Worker;

function runProgram(code: string, parallel = true)
{
	let blob = new Blob([code], {type: 'text/javascript'});
	let url = URL.createObjectURL(blob);
	let bdata = "";
	let worker: Worker;

	return new Promise((resolve, reject)=>{
		if (parallel) {
			worker = new Worker(url);
		}
		else{
			worker = globalWorker;
			worker.terminate();
			reject("Worker terminated.");
			(worker as any) = undefined;
		}

		let timeout = setTimeout(()=>{
			if (worker) {
				worker.terminate();
				reject("Code Timeout...");
				(worker as any) = undefined;
			}
		}, 5000);
		worker.onerror = (ev)=>{
			console.log(ev);
			reject("Syntax error. Please check.");
			clearTimeout(timeout);
			worker.terminate();
			(worker as any)	= undefined;
		}
		worker.onmessage = (m)=>{
			let data: IRuntimeResponse = m.data;
			if (data.type=="error") {
				reject(data.data);
			}
			else {
				resolve(data.data);
			}
			clearTimeout(timeout);
			worker.terminate();
			(worker as any)	= undefined;
		}	
	});
}