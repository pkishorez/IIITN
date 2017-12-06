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
	output?: string
	answered: boolean
};

let consoleStyle: React.CSSProperties = {
	position: 'relative',
	whiteSpace: "pre",
	overflowX: "hidden",
	fontSize: 14,
	fontWeight: 900,
	fontFamily: "monospace",
	padding: 20,
	margin:0,
	backgroundColor: 'black',
	color: 'cyan'
};

export class ConsoleTask extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			answered: false,
			output: undefined
		};
		this.runProgram = _.debounce(this.runProgram.bind(this), 100);
		this.SubmitProgram = this.SubmitProgram.bind(this);
	}
	componentWillMount() {
		this.runProgram(this.state.output);
	}
	runProgram(code: string="") {
		Runtime.run(code).then((output)=>{
			if (!this.state.output) {
				if (output==this.props.expectedOutput) {
					this.setState({
						answered: true
					});
				}
			}
			this.setState({
				output
			});	
		});
	}
	diffProgram(expectedOutput: string, actualOutput: string="") {
		var diff = jsdiff.diffChars(expectedOutput, actualOutput, {
			ignoreCase: false
		});
		return diff.map((part)=>{
			let style: React.CSSProperties = {
				letterSpacing: 1.4
			};
			style.color = part.added?'red':part.removed?'white':'cyan';
			style.fontWeight = (part.added || part.removed)?900:900;
			style.textShadow = (part.added || part.removed)?"":"0px 0px 5px white";
			style.backgroundColor = part.added?'rgba(255, 0, 0, 0.2)': part.removed?'rgba(255,255,255,0.2)':undefined;
			if (part.added || part.removed){
				part.value = part.value.replace(/\n/g, "⏎\n");
			}
			return <span style={style}>{part.value}</span>;
		});
	}
	SubmitProgram() {
		if (this.state.output!=this.props.expectedOutput){
			Flash.flash((dismiss)=>{
				return <div style={{...consoleStyle, maxWidth: 500}}>
					{this.diffProgram(this.props.expectedOutput, this.state.output)}
				</div>;
			}, false, true, true, "card-5");
		}
		this.setState({
			answered: (this.state.output==this.props.expectedOutput)
		});
	}
	render() {
		return <div style={{borderLeft: "3px solid "+(this.state.answered?"green":"red"), paddingLeft: 0, marginLeft: 0}}>
			{this.state.answered?<Layout style={{backgroundColor: "white",color: 'black', fontWeight: 900, padding: 20, margin: 0}}>
				<Section remain>Successfully completed the task!</Section>
				<Section>
					<span className="button flat" onClick={()=>this.setState({answered: false})}>
						Edit <i className="fa fa-edit"></i>
					</span>
				</Section>
			</Layout>:null}
			{(!this.state.answered)?<div>
				<PersistMonaco theme="vs-dark" fontWeight="900" id={this.props.eid} autoResize ctrlEnterAction={this.SubmitProgram} lineNumbers="on" noborder dimensions={{
					minHeight: 60,
					maxHeight: 200
				}} {...this.props.monaco} getOutput={this.runProgram}/>
				<div style={consoleStyle} >
					{/*<h4 style={{marginTop: 0, color: 'white'}}>Expected Output: </h4>*/}
					{this.props.expectedOutput}
				</div>
			</div>:null}
		</div>;
	}
};