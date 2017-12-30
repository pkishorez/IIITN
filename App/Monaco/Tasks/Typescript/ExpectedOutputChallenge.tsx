import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import * as _ from 'lodash';
import * as jsdiff from 'diff';
import {SAnim} from 'classui/Helper/Animation';
import { runProgramInNewScope, Runtime } from 'App/Monaco/Runtime';
import { Layout, Section } from 'classui/Components/Layout';
import { Flash } from 'classui/Components/Flash';
import { PersistMonaco } from 'App/State/Utils/PersistentMonaco';

interface IProps {
	eid: string
	monaco?: IMonacoProps
	code?: string
	expectedOutput: string
};
interface IState {
	output: string
	answered: boolean
};

let consoleStyle: React.CSSProperties = {
	position: 'relative',
	whiteSpace: "pre",
	overflowX: "hidden",
	fontSize: 14,
	fontWeight: 900,
	lineHeight: 1.6,
	minHeight: 100,
	fontFamily: "monospace",
	padding: 20,
	margin:0,
	backgroundColor: 'black',
	color: 'cyan'
};

export class ExpectedOutputChallenge extends React.Component<IProps, IState> {
	private editorRef: monaco.editor.IStandaloneCodeEditor;
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			answered: false,
			output: ""
		};
		this.SubmitProgram = this.SubmitProgram.bind(this);
	}
	SubmitProgram() {
		Runtime.run(this.editorRef.getValue()).then((output)=>{
			this.setState({
				output,
				answered: (output==this.props.expectedOutput)				
			});
		});
	}
	render() {
		return <Layout gutter={20} equallySpaced>
			<Section>
				<PersistMonaco id={this.props.eid} ctrlEnterAction={this.SubmitProgram} lineNumbers="on" noborder {...this.props.monaco} editorRef={(ref: any)=>this.editorRef=ref}/>
				<div style={{
					color: this.state.answered?"darkgreen":"red",
					fontWeight: 900,
					backgroundColor: 'white',
					padding: 20
				}}>
					{this.state.answered?"Success :)":"Expected output did not match."}
				</div>
			</Section>
			<Section>
				<div style={consoleStyle} >
					{/*<h4 style={{marginTop: 0, color: 'white'}}>Expected Output: </h4>*/}
					{this.state.output}
				</div>
			</Section>
		</Layout>;
	}
};