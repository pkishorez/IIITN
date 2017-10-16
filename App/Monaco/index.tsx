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
	lineNumbers?: "on" | "off"
	diffContent?: {
		content: string
	}
	content?: string
	autoFocus?: boolean
	getOutput?: (output: string)=>void
	processOutput?: (output: any)=>void
};
export interface IState {
	page_edited: boolean
};

export class Monaco extends React.Component<IProps, IState> {
	private editor: monaco.editor.IStandaloneCodeEditor;
	private diffEditor: monaco.editor.IStandaloneDiffEditor;
	static defaultProps = {
		width: "100%",
		height: 150,
		fontSize: 18,
		content: "",
		lineNumbers: "off",
		autoFocus: false
	};

	constructor(props: any, context: any)
	{
		super(props, context);
		this.destroyEditor = this.destroyEditor.bind(this);
		this.initMonaco = this.initMonaco.bind(this);
		this.initDiffMonaco = this.initDiffMonaco.bind(this);
		this._init = this._init.bind(this);
	}
	_init(func: Function) {
		this.destroyEditor();
		if(typeof monaco != "undefined") {
			func();
			return;
		}
		(window as any).require.config({ paths: { 'vs': '/bundle/vs' }});
		(window as any).require(['vs/editor/editor.main'], () => {
			if(typeof monaco != "undefined") {
				func();				
			}
		});
	}
	initMonaco(ref: HTMLDivElement|null)
	{
		if (!ref) {
			console.error("Reference Error, MONACO");
			return;
		}
		this._init(()=>{
			this.editor = monaco.editor.create(ref, {
				value: this.props.content,
				theme: "vs",
				//fontWeight: "900",
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
				lineNumbers: this.props.lineNumbers
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
				if (this.props.getOutput) {
					this.props.getOutput(value);
				}
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
			});
			if (this.props.autoFocus)
				this.editor.focus();
		})
	}

	initDiffMonaco(ref: HTMLDivElement | null)
	{
		if (!ref) {
			console.error("Reference Error, MONACO");
			return;
		}
		this._init(()=>{
			let original = monaco.editor.createModel(this.props.diffContent?this.props.diffContent.content:"", "typescript");
			let modified = monaco.editor.createModel(this.props.content?this.props.content:"", "typescript");
			this.diffEditor = monaco.editor.createDiffEditor(ref, {
				theme: "vs",
				fontFamily: 'Inconsolata',
				fontSize: 15,
				//fontWeight: "900",
				folding: true,
				quickSuggestions: false,
				parameterHints: false,
				suggestOnTriggerCharacters: false,
				wordWrap: "on",
				minimap: {
					enabled: false
				},
				enableSplitViewResizing: false,
				renderSideBySide: false,
				scrollBeyondLastLine: false,
				lineNumbers: this.props.lineNumbers
			});
			this.diffEditor.setModel({
				original,
				modified
			});
			this.diffEditor.getModel().modified.onDidChangeContent((e)=>{
				let value = this.diffEditor.getValue();
				if (this.props.getOutput) {
					this.props.getOutput(value);
				}
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
			if (this.props.autoFocus)
				this.editor.focus();
		})
	}
	destroyEditor()
	{
		if (this.editor)
			this.editor.dispose();
		if (this.diffEditor)
			this.diffEditor.dispose();
	}
	componentWillUnmount()
	{
		this.destroyEditor();
	}
	render() {
		return <div style={{marginBottom: 5}} className="card-0">
			<div style={{
				width: this.props.width, height: this.props.height
			}} ref={this.props.diffContent?this.initDiffMonaco:this.initMonaco}>
			</div>
		</div>;
	}
};