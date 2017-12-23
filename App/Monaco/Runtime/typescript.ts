import * as _ from 'lodash';
//import * as ts from 'typescript';
let ts = (window as any)._g_unique_typescript_identifier;

function transpileModule(input: string, options: any): {error?: string, code: string} {
	var inputFileName = options.jsx ? "module.tsx" : "module.ts";
	var sourceFile = ts.createSourceFile(inputFileName, input, options.target || ts.ScriptTarget.ES5);
	// Output
	var outputText;
	var program = ts.createProgram([inputFileName], {
		...options,
		noEmitOnError: false
	}, {
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

	let diagnostics = program.getSyntacticDiagnostics();
	let error = undefined;
	for (let i of diagnostics) {
		let message = i.messageText.toString() + "\n";
		error = error?error:"";
		error += message;
	}
	if (error) {
		return {
			error,
			code: ""
		}
	}
	if (outputText === undefined) {
		return {
			error: "Unknown Error.",
			code: ""
		}
	}
	return {
		code: outputText
	};
}

export function compileCode(code: string) {
	return transpileModule(code, {
		module: ts.ModuleKind.AMD,
		target: ts.ScriptTarget.ES5,
		noLib: true,
		noResolve: true,
		suppressOutputPathCheck: true
	});
}