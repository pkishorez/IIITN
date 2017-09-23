import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
	width?: string|number,
	height?: string|number
	autoFocus?: boolean
};
export interface IState {
	page_edited: boolean
};

export class Monaco extends React.Component<IProps, IState> {
	private editor: monaco.editor.IStandaloneCodeEditor;
	static defaultProps = {
		width: "100%",
		height: 100,
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
					folding: true,
					wordWrap: "on",
					minimap: {
						enabled: false
					},
					scrollBeyondLastLine: false,
					lineNumbers: "on"
				});
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
		return <div style={{marginBottom: 25, border: "1px solid grey"}} >
			<div style={{
				width: this.props.width, height: this.props.height
			}} ref={this.initMonaco}>
			</div>
		</div>;
	}
};