import {compileCode} from 'App/Monaco/Runtime/typescript';

export const canvasElemId = "__document_canvas_element__";
export let CompileCanvasCode = (code: string, canvasId?: string)=>{
	code = code.replace(/import [^\n]*\n/g, "");
	
	if (canvasId) {
		code = code.replace(/__document_canvas_element__/g, `${canvasId}`);
	}

	return compileCode(code);
};