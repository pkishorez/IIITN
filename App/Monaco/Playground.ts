import * as ts from 'typescript';
import * as _ from 'lodash';

export function transpileModule(input: string, options: any) {
	var inputFileName = options.jsx ? "module.tsx" : "module.ts";
	var sourceFile = ts.createSourceFile(inputFileName, input, options.target || ts.ScriptTarget.ES5);
	// Output
	var outputText;
	var program = ts.createProgram([inputFileName], options, {
		getSourceFile: function (fileName: any) { return fileName.indexOf("module") === 0 ? sourceFile : undefined; },
		writeFile: function (_name: any, text: any) { outputText = text; },
		getDefaultLibFileName: function () { return "lib.d.ts"; },
		useCaseSensitiveFileNames: function () { return false; },
		getCanonicalFileName: function (fileName: any) { return fileName; },
		getCurrentDirectory: function () { return ""; },
		getNewLine: function () { return "\r\n"; },
		fileExists: function (fileName: any) { return fileName === inputFileName; },
		readFile: function () { return ""; },
		directoryExists: function () { return true; },
		getDirectories: function () { return []; }
	} as any);
	// Emit
	program.emit();
	if (outputText === undefined) {
		throw new Error("Output generation failed");
	}
	return outputText;
}