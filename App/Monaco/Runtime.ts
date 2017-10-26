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
	runFunction(code: string, func: IFunction) {
		let genCode = Code.generate(`
			${code};
			let func = ${JSON.stringify(func)};
			let inputs = func.inputs;
			if (typeof ${func.name}=="function") {
				console = {
					log(msg){}
				}
				let outputs = [];
				for (let input of inputs) {
					let output = ${func.name}.apply(null, input.input);
					outputs.push(output);
				}
				self.postMessage({type: 'OUTPUT', data: outputs});
			}
			else {
				self.postMessage({type: 'error', data: 'Function ${func.name} not defined.'});
			}
		`);
		return runProgram(genCode) as any;
	}
};

interface IRuntimeResponse {
	type: "error" | "OUTPUT",
	data: any
};
let globalWorker: Worker;

let n_workers = 0;
let workers: Worker[] = [];
const N_MAX_WORKERS = 10;
function runProgram(code: string, worker_timeout=2)
{
	let blob = new Blob([code], {type: 'text/javascript'});
	let url = URL.createObjectURL(blob);
	let bdata = "";


	return new Promise((resolve, reject)=>{
		let rejectRequest = (msg: string)=>{
			n_workers--;
			reject(msg);
		}
		let resolveRequest = (msg: string)=>{
			n_workers--;
			resolve(msg);
		}
		if (n_workers>N_MAX_WORKERS) {
			reject("Too much computation. Please wait :(");
			return;
		}
		let worker = new Worker(url);
		n_workers++;

		let timeout = setTimeout(()=>{
			if (worker) {
				worker.terminate();
				rejectRequest("Code Timeout...");
				(worker as any) = undefined;
			}
		}, worker_timeout*1000);
		worker.onerror = (ev)=>{
			console.log(ev);
			rejectRequest("Syntax error. Please check.");
			clearTimeout(timeout);
			worker.terminate();
			(worker as any)	= undefined;
		}
		worker.onmessage = (m)=>{
			let data: IRuntimeResponse = m.data;
			if (data.type=="error") {
				rejectRequest(data.data);
			}
			else {
				resolveRequest(data.data);
			}
			clearTimeout(timeout);
			worker.terminate();
			(worker as any)	= undefined;
		}
	});
}