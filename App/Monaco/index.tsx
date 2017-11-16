import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

declare let monacoAmdRequire: any;

export interface IMonacoProps {
	width?: string|number
	height?: string|number
	fontSize?: number
	fontFamily?: string
	lineNumbers?: "on" | "off"
	editorRef?: (ref: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor)=>void
	diffContent?: {
		content: string
	}
	content?: string
	ctrlEnterAction?: ()=>void
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
		fontSize: 15,
		fontFamily: 'Inconsolata',
		content: "",
		quickSuggestions: true,
		parameterHints: true,
		readOnly: false,
		lineNumbers: "on",
		autoFocus: false
	};

	private static _typescriptDefaults: {
		compilerOptions: monaco.languages.typescript.CompilerOptions
	};
	static get typescriptDefaults() {
		return Monaco._typescriptDefaults;
	}

	constructor(props: any, context: any)
	{
		super(props, context);
		this.destroyEditor = this.destroyEditor.bind(this);
		this.initMonaco = this.initMonaco.bind(this);
		this.initDiffMonaco = this.initDiffMonaco.bind(this);
	}
	static INIT(func: Function) {
		if(typeof monaco != "undefined") {
			func();
			return;
		}
		monacoAmdRequire.config({ paths: { 'vs': '/assets/vs' }});
		monacoAmdRequire(['vs/editor/editor.main'], () => {
			if(typeof monaco != "undefined") {
				this._typescriptDefaults = {
					compilerOptions: {
						target: monaco.languages.typescript.ScriptTarget.ES2016,
						noImplicitAny: true,
						noUnusedParameters: true,
						noImplicitReturns: true,
						alwaysStrict: true,
						noUnusedLocals: true,
						allowNonTsExtensions: true,
						strictNullChecks: true
					}
				};
				monaco.languages.typescript.typescriptDefaults.setCompilerOptions(this.typescriptDefaults.compilerOptions);
				func();
			}
		});
	}
	initMonaco(ref: HTMLDivElement|null)
	{
		if (!ref) {
			return;
		}
		Monaco.INIT(()=>{
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
				wordWrap: "on",
				minimap: {
					enabled: false
				},
				scrollBeyondLastLine: false,
				lineNumbers: this.props.lineNumbers
			});
			if (this.props.editorRef) {
				this.props.editorRef(this.editor);
			}
			this.editor.onKeyDown(e=>{
				if (e.ctrlKey && e.code=="Enter") {
					e.stopPropagation();
					e.preventDefault();
					e.browserEvent.stopImmediatePropagation();

					// Add action if ctrlEnter. This will become famous keybinding for Monaco in IIITN.
					this.props.ctrlEnterAction && this.props.ctrlEnterAction();
				}
			});
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
		Monaco.INIT(()=>{
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
				suggestOnTriggerCharacters: false,
				wordWrap: "on",
				automaticLayout: true,				
				minimap: {
					enabled: true
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
			this.diffEditor.getModifiedEditor().onDidChangeModelContent((e)=>{
				let value = this.diffEditor.getValue();
				if (this.props.getOutput) {
					this.props.getOutput(value);
				}
			});
			this.diffEditor.getModifiedEditor().onKeyDown(e=>{
				if (e.ctrlKey && e.code=="Enter") {
					e.stopPropagation();
					e.preventDefault();
					e.browserEvent.stopImmediatePropagation();

					// Add action if ctrlEnter. This will become famous keybinding for Monaco in IIITN.
					this.props.ctrlEnterAction && this.props.ctrlEnterAction();
				}
			});
			if (this.props.editorRef) {
				this.props.editorRef(this.diffEditor);
			}
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
		return <div style={{border: '1px solid rgba(0, 0, 0, 0.2)', marginBottom: 20}}>
			<div style={{
				width: this.props.width,
				height: this.props.height,
				backgroundColor: 'white'
			}} ref={this.props.diffContent?this.initDiffMonaco:this.initMonaco}></div>
		</div>;
	}
};