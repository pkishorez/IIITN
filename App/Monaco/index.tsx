import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {transpileModule} from './Playground';
import {runProgram, throttleRunProgram} from './Runtime';
import * as _ from 'lodash';
import * as ts from 'typescript';

export interface IProps {
	width?: string|number
	height?: string|number
	fontSize?: number
	autoFocus?: boolean
	processOutput?: (output: any)=>void
};
export interface IState {
	page_edited: boolean
};

export class Monaco extends React.Component<IProps, IState> {
	private editor: monaco.editor.IStandaloneCodeEditor;
	static defaultProps = {
		width: "100%",
		height: 300,
		fontSize: 20,
		autoFocus: false
	};

	constructor(props: any, context: any)
	{
		super(props, context);
		this.destroyEditor = this.destroyEditor.bind(this);
		this.initMonaco = this.initMonaco.bind(this);
	}
	initMonaco(ref: HTMLDivElement|null)
	{
		this.destroyEditor();
		if (!ref){
			console.error("Ref error.");
			return;
		}
		(window as any).require.config({ paths: { 'vs': '/bundle/vs' }});
		(window as any).require(['vs/editor/editor.main'], () => {
			if(typeof monaco != "undefined") {
				this.editor = monaco.editor.create(ref, {
					value: "Hello",
					language: 'typescript',
					fontFamily: 'Inconsolata',
					fontSize: this.props.fontSize,
					folding: true,
					quickSuggestions: false,
					wordWrap: "on",
					minimap: {
						enabled: false
					},
					scrollBeyondLastLine: false,
					lineNumbers: "on"
				});
				this.editor.onKeyDown(e=>{
					if (e.ctrlKey && e.code=="Enter") {
						e.stopPropagation();
						e.preventDefault();
						e.browserEvent.stopImmediatePropagation();
						let sel = this.editor.getSelection();
					}
				})
				this.editor.getModel().onDidChangeContent((e)=>{
					let value = this.editor.getValue();
					let onother = transpileModule(value, {
						module: ts.ModuleKind.AMD,
						target: ts.ScriptTarget.ES5,
						noLib: true,
						noResolve: true,
						suppressOutputPathCheck: true
					});
					throttleRunProgram(onother, (ev: {type: "error"|"OUTPUT", data: string})=>{
						console.log(ev);
						this.props.processOutput?this.props.processOutput(ev):null;
					});
				})
				this.editor.getModel().updateOptions({
					insertSpaces: false
				})
				if (this.props.autoFocus)
					this.editor.focus();
			}
		});
	}
	destroyEditor()
	{
		if (this.editor)
			this.editor.dispose();
	}
	componentWillUnmount()
	{
		this.destroyEditor();
	}
	render() {
		return <div style={{marginBottom: 5}} className="card-0">
			<div style={{
				width: this.props.width, height: this.props.height
			}} ref={this.initMonaco}>
			</div>
		</div>;
	}
};