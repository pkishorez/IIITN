import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor, Draft, EditorState,convertToRaw, convertFromRaw, ContentBlock, RichUtils, CompositeDecorator, KeyBindingUtil, getDefaultKeyBinding} from 'draft-js';
import {Layout, Section} from 'classui/Components/Layout';
import * as Immutable from 'immutable';

export {EditorState, convertToRaw} from 'draft-js';

interface IProps {
	defaultState?: string
	deditor?: Draft.Component.Base.DraftEditorProps
	onChange?: (editorState: EditorState)=>void
	style?: React.CSSProperties
};
interface IState {
	editorState: EditorState
};

let blockStyleFn = (content: ContentBlock)=>{
	if (content.getType()=="unstyled") {
		return "nostyle";
	}
	return "";
}

export class DraftEditor extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.onChange = this.onChange.bind(this);
		this.handleKeyCommand = this.handleKeyCommand.bind(this);

		let hashStrategy = (block: any, callback: any, contentState: any)=>{
			let text = block.getText();
			let matchArr, start;
			matchArr = /\#[a-zA-Z _]+/.exec(text);
			if (matchArr) {
				start = matchArr.index;
				callback(start, start + matchArr[0].length);
			}
		}
		let hashSpan = (props: any)=>{
			return <div style={{color: 'green'}}>{props.children}</div>;
		}
		let decorator = new CompositeDecorator([
			{
				strategy: hashStrategy,
				component: hashSpan
			}
		]);
		let editorState = EditorState.createEmpty();		
		if (props.defaultState) {
			editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(props.defaultState)));
		}
		this.state = {
			editorState: EditorState.set(editorState, {decorator})
		};
		this.onChange(editorState);
	}
	onChange(editorState: EditorState)
	{
		if (this.props.onChange) {
			this.props.onChange(editorState);
		}
		this.setState({
			editorState
		});
	}
	handleKeyCommand(command: any, editorState: EditorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}
	myKeyBindingFn(e: any) {
		if (e.keyCode==83 && KeyBindingUtil.hasCommandModifier(e)){
			return "sample";
		}
		return getDefaultKeyBinding(e);
	}
	render() {
		return <div className="draftEditor" style={this.props.style}>
			<Controls editorState={this.state.editorState} onChange={this.onChange}/>
			<Editor
				placeholder="Type Here..."
				{...this.props.deditor}
				editorState={this.state.editorState}
				handleKeyCommand={this.handleKeyCommand}
				onChange={this.onChange}
				spellCheck={true}
				keyBindingFn={this.myKeyBindingFn}
				blockStyleFn={blockStyleFn}
			/>
		</div>;
	}
}

export let DraftEditorRender = (props: {contentState?: string})=>{
	let editorState = props.contentState?
		EditorState.createWithContent(convertFromRaw(JSON.parse(props.contentState))):
		EditorState.createEmpty();
	return <div className="draftEditor" style={{padding: 5}}>
		<Editor 
		editorState={editorState}
		readOnly
		onChange={()=>{}}
		blockStyleFn={blockStyleFn}
	/>
	</div>;
};

interface IControlProps {
	editorState: EditorState
	onChange: (state: EditorState)=>void
}
const BLOCK_TYPES = [
	{label: 'H1', style: 'header-one'},
	{label: 'H2', style: 'header-two'},
	{label: 'H3', style: 'header-three'},
	{label: 'H4', style: 'header-four'},
	{label: 'H5', style: 'header-five'},
	{label: 'H6', style: 'header-six'},
	{label: 'Blockquote', style: 'blockquote'},
	{label: 'UL', style: 'unordered-list-item'},
	{label: 'OL', style: 'ordered-list-item'},
	{label: 'Code Block', style: 'code-block'},
];

let Controls = (props: IControlProps)=>{
	const blockType = props.editorState.getCurrentContent()
	.getBlockForKey(props.editorState.getSelection().getStartKey())
	.getType();
	return <Layout gutter={7} justify="start">
		{/*BLOCK CONTROLS GOES HERE...*/}
		{
			BLOCK_TYPES.map((block)=>{
				return <Section key={block.label}>
					<span className={"button inline-block "+(blockType==block.style?"active":"")} onClick={()=>{
						props.onChange(RichUtils.toggleBlockType(
							props.editorState,
							block.style
						))
					}}>{block.label}</span>
				</Section>
			})
		}
	</Layout>;
}