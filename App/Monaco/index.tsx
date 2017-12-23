import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {MonacoLibs} from './Libs';
import { IJSONSchema } from 'classui/Components/Form/Schema';

declare let monacoAmdRequire: any;

export interface IMonacoProps {
	theme?: "vs"|"vs-dark"
	fontWeight?: monaco.editor.IEditorConstructionOptions["fontWeight"]
	autoResize?: boolean
	dimensions?: {
		width?: string|number
		height?: string|number
		minHeight?: number | string
		maxHeight?: number | string
	}
	noOverflow?: boolean
	noborder?: boolean
	shouldHaveMarginBottom?: boolean
	shouldHaveMarginTop?: boolean
	fontSize?: number
	fontFamily?: string
	lineNumbers?: "on" | "off"
	editorRef?: (ref: monaco.editor.IStandaloneCodeEditor | monaco.editor.IStandaloneDiffEditor)=>void
	diffContent?: {
		content: string
	}
	style?: React.CSSProperties
	language?: "json" | "typescript"
	schema?: IJSONSchema
	content?: string
	ctrlEnterAction?: (output: string)=>void
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
	dimRef: HTMLDivElement | null;
	private editor: monaco.editor.IStandaloneCodeEditor;
	private diffEditor: monaco.editor.IStandaloneDiffEditor;
	static defaultProps: IMonacoProps = {
		dimensions: {
			minHeight: 0,
			height: "auto",
			width: "100%"
		},
		noOverflow: false,
		language: "typescript",
		autoResize: false,
		noborder: false,
		theme: "vs",
		fontSize: 15,
		fontWeight: "inherit",
		fontFamily: 'Inconsolata',
		shouldHaveMarginBottom: false,
		shouldHaveMarginTop: false,
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
		this.autoResize = this.autoResize.bind(this);
	}

	componentWillReceiveProps(nextProps: IMonacoProps) {
		if (!_.isEqual(nextProps.dimensions, this.props.dimensions)) {
			this.autoResize(nextProps.dimensions);
		}
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
						noImplicitAny: false,
						noUnusedParameters: false,
						noImplicitReturns: true,
						alwaysStrict: true,
						noUnusedLocals: false,
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
			if (this.props.language=="json") {
				monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
					schemas: [{
						uri: "http://cseclub/functionDetails",
						schema: this.props.schema
					}]
				});
			}
			this.editor = monaco.editor.create(ref, {
				value: this.props.content,
				theme: this.props.theme,
				language: this.props.language,
				fontWeight: this.props.fontWeight,
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
					this.props.ctrlEnterAction && this.props.ctrlEnterAction(this.editor.getValue());
				}
			});
			this.editor.getModel().onDidChangeContent((e)=>{
				let value = this.editor.getValue();
				if (this.props.getOutput) {
					this.props.getOutput(value);
				}
				this.autoResize(this.props.dimensions);
			})
			if (this.props.content && this.props.getOutput) {
				this.props.getOutput(this.props.content);
				this.autoResize(this.props.dimensions);
			}
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
				theme: this.props.theme,
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
				this.autoResize(this.props.dimensions);
			});
			if (this.props.content && this.props.getOutput) {
				this.props.getOutput(this.props.content);
				this.autoResize(this.props.dimensions);
			}
			this.diffEditor.getModifiedEditor().onKeyDown(e=>{
				if (e.ctrlKey && e.code=="Enter") {
					e.stopPropagation();
					e.preventDefault();
					e.browserEvent.stopImmediatePropagation();

					// Add action if ctrlEnter. This will become famous keybinding for Monaco in IIITN.
					this.props.ctrlEnterAction && this.props.ctrlEnterAction(this.diffEditor.getValue());
				}
			});
			if (this.props.editorRef) {
				this.props.editorRef(this.diffEditor);
			}
			if (this.props.autoFocus)
				this.editor.focus();
		})
	}

	autoResize(dimensions: IMonacoProps["dimensions"]) {
		if (!this.props.autoResize) {
			return;
		}
		let config = this.editor.getConfiguration();
		let lineHeight = config.lineHeight;
		let totalLineNumbers = 1;
		let horizontalScrollbarHeight = config.layoutInfo.horizontalScrollbarHeight;

		if (this.diffEditor){
			totalLineNumbers += this.diffEditor.getModifiedEditor().getModel().getLineCount();
		}
		if (this.editor) {
			totalLineNumbers += this.editor.getModel().getLineCount();
		}
		if (this.dimRef)
			this.dimRef.style.height = lineHeight*totalLineNumbers + horizontalScrollbarHeight + 'px';
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
		let height = `calc(100% - ${(this.props.shouldHaveMarginBottom?25:0) + (this.props.shouldHaveMarginTop?25:0)}px)`
		return <div ref={(ref)=>this.dimRef=ref} style={{
				position: "relative",
				maxWidth: "100%",
				overflow: this.props.noOverflow?"auto":"hidden",
				...this.props.dimensions,
				...this.props.style
			}}>
			<div style={{
				position: "absolute",
				top: "0px",
				left: "0px",
				border: this.props.noborder?undefined:'1px solid rgba(0, 0, 0, 0.2)',
				height: height,
				width: "100%",
				marginBottom: this.props.shouldHaveMarginBottom?25:"auto",
				marginTop: this.props.shouldHaveMarginTop?25:"auto",
				backgroundColor: 'white'
			}} ref={this.props.diffContent?this.initDiffMonaco:this.initMonaco}></div>
		</div>;
	}
};