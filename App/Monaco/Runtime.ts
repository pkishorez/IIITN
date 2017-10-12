import * as _ from 'lodash';

// POST MESSAGE
let BUFFER_SIZE = 5;
let processCode = (code: string)=> `
var __kishore_bdata = "";
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
}
try {
	${code}
	self.postMessage({type: "OUTPUT", data: __kishore_bdata});
}
catch(e) {
	self.postMessage({type: "error", data: e});
}`;

let worker: Worker;

export let throttleRunProgram = _.throttle(runProgram, 10, {
	trailing: true,
	leading: false
});

export function runProgram(code: string, msg: Function)
{
	let blob = new Blob([processCode(code)], {type: 'text/javascript'});
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