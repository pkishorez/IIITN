import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from './';

export let MonacoLibs = {
	loadCanvas() {
		fetch("/assets/canvas2d/Canvas_bundled.d.ts").then((res)=>{
			let def = res.text().then((data)=>{
				Monaco.INIT(()=>{
					monaco.languages.typescript.typescriptDefaults.addExtraLib(data);
					monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
						...Monaco.typescriptDefaults.compilerOptions,
						noUnusedLocals: false,
						noUnusedParameters: false
					});
				})
			});
		}).catch((err)=>console.log(err));
	}
};