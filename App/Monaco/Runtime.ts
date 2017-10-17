import * as _ from 'lodash';
import {transpileModule} from './Playground';
import * as ts from 'typescript';

// POST MESSAGE
let BUFFER_SIZE = 5;

let Code = {
	_before: `var __kishore_bdata = "";
	console = {
		log: function(msg) {
			msg = msg.toString();
			if ((__kishore_bdata.length+msg.length)>(${BUFFER_SIZE}*1024)) {
				//self.postMessage({type: "error", data: "Buffer Overflow. Output cannot exceed 5KB."});
				throw("Buffer Overflow. Output cannot exceed ${BUFFER_SIZE}KB.");
				return;
			}
			__kishore_bdata += msg;
		}
	}`,
	_after: ``,
	generate(code: string) {
		// Transpile Typescript to Javascript.
		code = transpileModule(code, {
			module: ts.ModuleKind.AMD,
			target: ts.ScriptTarget.ES5,
			noLib: true,
			noResolve: true,
			suppressOutputPathCheck: true
		});
		return `
		${this._before}
		try {
			${code}
		}
		catch(e) {
			self.postMessage({type: "error", data: e});
		}
		${this._after}
		`;
	}
}

export interface IFunction {
	name: string
	testcases: {
		input: number[]
		output: any
	}
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
			if (${func.name}) {
				let output = ${func.name}.apply(null, [${func.testcases.input}]);
				self.postMessage({type: 'OUTPUT', data: output});
			}
			else {
				self.postMessage({type: 'error', data: 'Function ${func.name} not defined.'});
			}
		`);
		return runProgram(genCode);
	}
};

interface IRuntimeResponse {
	type: "error" | "OUTPUT",
	data: any
};
let worker: Worker;

function runProgram(code: string)
{
	let blob = new Blob([code], {type: 'text/javascript'});
	let url = URL.createObjectURL(blob);
	let bdata = "";

	if (worker) {
		worker.terminate();
		(worker as any) = undefined;
	}
	worker = new Worker(url);

	return new Promise((resolve, reject)=>{
		let timeout = setTimeout(function(){
			if (worker) {
				worker.terminate();
				reject("Code Timeout...");
				(worker as any) = undefined;
			}
		}, 5000);
		worker.onerror = (ev)=>{
			reject(ev.lineno+" - "+ev.colno+":: "+ev.message);
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