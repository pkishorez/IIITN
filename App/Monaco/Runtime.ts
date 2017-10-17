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
	run(code: string, msg: Function) {
		let genCode = Code.generate(`
			${code};
			self.postMessage({type: "OUTPUT", data: __kishore_bdata});
		`);
		runProgram(genCode, msg);
	},
	runFunction(code: string, func: IFunction, msg: Function) {
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
		runProgram(genCode, msg);
	}
};
let worker: Worker;

function runProgram(code: string, msg: Function)
{
	let blob = new Blob([code], {type: 'text/javascript'});
	let url = URL.createObjectURL(blob);
	let bdata = "";

	if (worker) {
		worker.terminate();
		(worker as any) = undefined;
	}
	worker = new Worker(url);

	let timeout = setTimeout(function(){
		if (worker) {
			worker.terminate();
			msg({type: "error", data: "Code Timeout..."});
			(worker as any) = undefined;
		}
	}, 5000);
	worker.onerror = (ev)=>{
		msg({type: "error", data: ev.lineno+" - "+ev.colno+":: "+ev.message});
		clearTimeout(timeout);
		worker.terminate();
		(worker as any)	= undefined;
	}
	worker.onmessage = (m: any)=>{
		msg(m.data);
		clearTimeout(timeout);
		worker.terminate();
		(worker as any)	= undefined;
	}
}