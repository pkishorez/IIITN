import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Editor, Draft, EditorState,convertToRaw, convertFromRaw, RichUtils, CompositeDecorator, KeyBindingUtil, getDefaultKeyBinding, Entity} from 'draft-js';
import {Layout, Section} from 'classui/Components/Layout';
import {Drawer} from 'classui/Components/Drawer';
import {blockStyleFn, blockRenderedFn} from './_utils';
import * as Immutable from 'immutable';
import { AddOrEditAtomicBlock } from 'App/DraftEditor/AtomicBlock';
import { TextField } from 'classui/Components/Formlayout/TextField';
import { Formlayout } from 'classui/Components/Formlayout';
import { IMonacoPracticeProps } from 'App/DraftEditor/AtomicBlock/MonacoPractice';
import {v4} from 'uuid';

export {EditorState, convertToRaw} from 'draft-js';

interface IProps {
	height?: string | number
	defaultState?: string
	deditor?: Draft.Component.Base.DraftEditorProps
	onChange?: (editorState: EditorState)=>void
	style?: React.CSSProperties
};
interface IState {
	editorState: EditorState
};

export class DraftEditor extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.onChange = this.onChange.bind(this);
		this.handleKeyCommand = this.handleKeyCommand.bind(this);

		let editorState = EditorState.createEmpty();
		if (props.defaultState) {
			editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(props.defaultState)));
		}
		this.state = {
			editorState
		};
	}
	componentWillMount() {
		this.onChange(this.state.editorState);
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
	render() {
		return <Layout cls="draftEditor" direction="column" basis={this.props.height} style={this.props.style}>
			<Section>
				<Controls editorState={this.state.editorState} onChange={this.onChange}/>
			</Section>
			<Section remain style={{minHeight: 100}}>
				<Editor
					placeholder="Type Here..."
					{...this.props.deditor}
					editorState={this.state.editorState}
					handleKeyCommand={this.handleKeyCommand}
					onChange={this.onChange}
					spellCheck={true}
					blockStyleFn={blockStyleFn}
					blockRendererFn={blockRenderedFn}
				/>
			</Section>
		</Layout>;
	}
}


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

class Controls extends React.Component<IControlProps>{
	constructor(props: any, context: any) {
		super(props, context);
	}
	render() {
		const blockType = this.props.editorState.getCurrentContent()
		.getBlockForKey(this.props.editorState.getSelection().getStartKey())
		.getType();
		return <div>
			{/*BLOCK CONTROLS GOES HERE...*/}
			{
				BLOCK_TYPES.map((block)=>{
					return <span key={block.label} style={{marginRight: 7, marginBottom: 7}} className={
						"button noTextWrap inline-block "+(blockType==block.style?"active":"")
					} onClick={()=>{
						this.props.onChange(RichUtils.toggleBlockType(
							this.props.editorState,
							block.style
						))
					}}>{block.label}</span>
				})
			}
			<span className={
				"button noTextWrap inline-block primary "+(blockType=="atomic"?"active":"")
			} style={{marginRight: 7, marginBottom: 7}}
			onClick={()=>{
				Drawer.open((dismiss)=>{
					return <Formlayout label="Atomic Block Details" onSubmit={(data: IMonacoPracticeProps)=>{
						data.eid = v4();
						let uEditorState = AddOrEditAtomicBlock(this.props.editorState, {
							type:"MONACO_PRACTICE",
							value: data
						});
						uEditorState = EditorState.forceSelection(uEditorState, uEditorState.getSelection());
						this.props.onChange(uEditorState);
						dismiss();
					}}>
						<TextField type="area" autoFocus name="expectedOutput">Expected Output.</TextField>
						<input type="submit" value="Add/Edit Task."/>
					</Formlayout>;
				})
			}}>Editor</span>
		</div>;	
	}
}