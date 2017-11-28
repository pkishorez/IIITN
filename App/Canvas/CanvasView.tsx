import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MonacoLibs} from 'App/Monaco/Libs';
import {runProgramInNewScope} from 'App/Monaco/Runtime';
import {CompileCanvasCode} from './Runtime';
import {v4} from 'uuid';

MonacoLibs.loadCanvas();

interface IProps{
	style?: React.CSSProperties
	width?: string | number
	height?: string | number
	code: string
}
interface IState{}

export class CanvasView extends React.Component<IProps, IState> {
	uid: string = v4();
	constructor(props: IProps, context: any) {
		super(props, context);
		this.runCode = this.runCode.bind(this);
	}
	componentDidMount() {
		this.runCode(this.props.code);
	}
	componentWillReceiveProps(nextProps: IProps) {
		if (this.props.code!=nextProps.code)
			this.runCode(nextProps.code);
	}
	runCode(code: string) {
		let compiled_code = CompileCanvasCode(code, this.uid);
		runProgramInNewScope(compiled_code);
	}
	render()
	{
		return <canvas id={this.uid} style={{
			maxWidth: "100%",
			...this.props.style
		}} width={this.props.width} height={this.props.height}></canvas>;
	}
}