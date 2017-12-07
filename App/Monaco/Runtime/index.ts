import * as _ from 'lodash';
import {compileCode} from './typescript';
import * as ts from 'typescript';
export {compileCode} from './typescript';
export {Runtime, IFunctionDetails} from './Tasks';

interface IRuntimeResponse {
	type: "error" | "OUTPUT",
	data: any
};
let globalWorker: Worker;

let n_workers = 0;
let workers: Worker[] = [];
const N_MAX_WORKERS = 10;

export function runProgramInWorker<T>(code: string, worker_timeout=2)
{
	let blob = new Blob([code], {type: 'text/javascript'});
	let url = URL.createObjectURL(blob);
	let bdata = "";


	return new Promise<T>((resolve, reject)=>{
		let rejectRequest = (msg: string)=>{
			n_workers--;
			reject(msg);
		}
		let resolveRequest = (msg: T)=>{
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
			rejectRequest("Syntax error.");
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

export function runProgram(code: string) {
	var script = document.createElement("script");
	// Add script content
	script.innerHTML = code;
	document.body.appendChild(script);
}


export function runProgramInNewScope(code: string) {
	var script = document.createElement("script");
	// Add script content
	script.innerHTML = `(function(){
	${code}
})()`;
	document.body.appendChild(script);
}