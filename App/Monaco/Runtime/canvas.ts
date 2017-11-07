import {compileCode} from './typescript';

export let CompileCanvasCode = (code: string, canvasId?: string)=>{
	code = code.replace(/^import [^\n]*/g, "");
	code = code.replace(/^[\n]import [^\n]*/g, "");
	
	if (canvasId) {
		code = code.replace(/__KISHORE_CANVAS_ID__/g, `document.getElementById('${canvasId}')`);
	}

	console.log("COMPILED", code);
	return compileCode(code);
};