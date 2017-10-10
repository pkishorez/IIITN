import * as _ from 'lodash';

// POST MESSAGE
let BUFFER_SIZE = 5;
let processCode = (code: string)=> `
var __kishore_bdata = "";
var Console = console;
console = {
	log: function(msg) {
		if ((__kishore_bdata.length+msg.length)>(BUFFER_SIZE*1024)) {
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
}
`;

let worker: Worker;

export let throttleRunProgram = _.throttle(runProgram, 100, {
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
worker.onerror = (ev)=>{
	console.log(ev.lineno+" - "+ev.colno+":: "+ev.message);
}
worker.onmessage = (m: any)=>{
	msg(m.data);
}

setTimeout(function(){
	if (worker) {
		worker.terminate();
		(worker as any) = undefined;
	}
}, 500000);
}