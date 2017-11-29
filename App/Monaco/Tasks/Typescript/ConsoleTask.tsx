import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import * as _ from 'lodash';
import * as jsdiff from 'diff';
import {SAnim} from 'classui/Helper/Animation';
import { runProgramInNewScope, Runtime } from 'App/Monaco/Runtime';
import { Layout, Section } from 'classui/Components/Layout';
import { Flash } from 'classui/Components/Flash';

interface IProps {
	monaco?: IMonacoProps
	expectedOutput: string
};
interface IState {
	view: any
	output?: string
	answered: boolean
};

export class ConsoleTask extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			view: null,
			answered: false
		};
		this.runProgram = _.debounce(this.runProgram.bind(this), 100);
		this.evaluateProgram = this.evaluateProgram.bind(this);
		this.SubmitProgram = this.SubmitProgram.bind(this);
	}
	componentWillMount() {
		this.evaluateProgram("");
	}
	runProgram(code: string) {
		Runtime.run(code).then((output)=>{
			this.evaluateProgram(output);
		});
	}
	evaluateProgram(output: string) {
		const expectedOutput = this.props.expectedOutput;
		const actualOutput = output;
		var diff = jsdiff.diffChars(this.props.expectedOutput, output, {
			ignoreCase: false
		});
		let view = diff.map((part)=>{
			let style: React.CSSProperties = {};
			style.color = part.added?'black':part.removed?'black':'darkgreen';
			style.backgroundColor = part.added?'rgba(255, 0, 0, 0.1)': part.removed?'rgba(255, 0, 0, 0.1)':undefined;
			if (part.added || part.removed){
				part.value = part.value.replace(/\n/g, "⏎\n");
			}
			return <span style={style}>{part.value}</span>;
		})
		this.setState({
			view,
			output
		});
	}
	SubmitProgram() {
		Flash.flash((dismiss)=>{
			return <div style={{position: 'relative', whiteSpace: "pre-line", fontSize: 15, fontFamily: "monospace", padding: 20, margin:0, backgroundColor: 'white', color: 'black'}} className="card-0">
				{this.state.view}
			</div>;
		}, false, true, true);
		this.setState({
			answered: (this.state.output==this.props.expectedOutput)
		});
	}
	render() {
		return <div style={{borderLeft: "3px solid red", paddingLeft: 20, marginLeft: 20}}>
			<div style={{backgroundColor: "rgba(0,0,0,0.05)", color: 'black', fontWeight: 900, padding: 20, margin: 0}}>
				Write a program to print 'Hello World.\n'.
			</div>
			{(!this.state.answered)?<div>
				<Monaco ctrlEnterAction={this.SubmitProgram} lineNumbers="on" theme="vs" noborder dimensions={{
					minHeight: 100,
					maxHeight: 200
				}} {...this.props.monaco} getOutput={this.runProgram}/>
				<div className="card-0" style={{position: 'relative', whiteSpace: "pre-line", fontSize: 15, fontFamily: "monospace", padding: 20, margin:0, backgroundColor: 'white', color: 'black'}}>
					{this.state.output}
				</div>
			</div>:null}
		</div>;
	}
};