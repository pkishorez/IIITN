import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from './';

interface IProps extends IMonacoProps {};
interface IState {
	loaded: boolean
};

export class CanvasMonaco extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.state = {
			loaded: false
		};
		fetch("/assets/canvas2d/Canvas_bundled.d.ts").then((res)=>{
			let def = res.text().then((data)=>{
				Monaco.INIT(()=>{
					monaco.languages.typescript.typescriptDefaults.addExtraLib(data);
					monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
						...Monaco.typescriptDefaults.compilerOptions,
						noUnusedLocals: false,
						noUnusedParameters: false
					});
					this.setState({
						loaded: true
					});
				})
			});
		}).catch((err)=>console.log(err));
	}
	render() {
		if (this.state.loaded)
			return <Monaco {...this.props}/>
		return <div>Loading...</div>;
	}
};