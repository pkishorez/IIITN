import {compileCode} from './typescript';

export let CompileCanvasCode = (code: string)=>{
	code = code.replace(/^import [^\n]*/g, "");
	code = code.replace(/^[\n]import [^\n]*/g, "");
	
	return compileCode(code);
};