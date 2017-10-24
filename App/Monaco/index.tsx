import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

export interface IMonacoProps {
	width?: string|number
	height?: string|number
	fontSize?: number
	fontFamily?: string
	lineNumbers?: "on" | "off"
	diffContent?: {
		content: string
	}
	content?: string
	quickSuggestions?: boolean
	parameterHints?: boolean
	readOnly?: boolean
	autoFocus?: boolean
	getOutput?: (output: string)=>void
};
export interface IMonacoState {
	page_edited: boolean
};

export class Monaco extends React.Component<IMonacoProps, IMonacoState> {
	private editor: monaco.editor.IStandaloneCodeEditor;
	private diffEditor: monaco.editor.IStandaloneDiffEditor;
	static defaultProps = {
		width: "100%",
		height: 150,
		fontSize: 16,
		fontFamily: 'Inconsolata',
		content: "",
		quickSuggestions: true,
		parameterHints: true,
		readOnly: false,
		lineNumbers: "on",
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
		(window as any).require.config({ paths: { 'vs': '/assets/vs' }});
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
				language: 'typescript',
				fontFamily: this.props.fontFamily,
				fontSize: this.props.fontSize,
				folding: true,
				automaticLayout: true,
				quickSuggestions: this.props.quickSuggestions,
				parameterHints: this.props.parameterHints,
				readOnly: this.props.readOnly,
				multiCursorModifier: "ctrlCmd",
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
				fontFamily: this.props.fontFamily,
				fontSize: this.props.fontSize,
				folding: true,
				quickSuggestions: this.props.quickSuggestions,
				parameterHints: this.props.parameterHints,
				readOnly: this.props.readOnly,
				multiCursorModifier: "ctrlCmd",
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
				width: this.props.width, height: this.props.height, paddingTop: 10, paddingBottom: 10, backgroundColor: 'white'
			}} ref={this.props.diffContent?this.initDiffMonaco:this.initMonaco}>
			</div>
		</div>;
	}
};