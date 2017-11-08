import {compileCode} from './typescript';

export let CompileCanvasCode = (code: string, canvasId?: string)=>{
	code = code.replace(/import [^\n]*\n/g, "");
	
	if (canvasId) {
		code = code.replace(/__document_canvas_element__/g, `${canvasId}`);
	}

	console.log("COMPILED", code);
	return compileCode(code);
};