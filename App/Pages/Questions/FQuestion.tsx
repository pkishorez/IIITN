import * as React from 'react';
import {Monaco, IMonacoProps} from '../../Monaco';
import {IFunction, Runtime} from '../../Monaco/Runtime';
import * as _ from 'lodash';

export interface IFQuestionProps {
	funcName: string
	answers: {
		input: any[],
		output: any
	}[]
	testCasesPassed?: (num: number)=>void
	style?: React.CSSProperties
	monaco?: IMonacoProps
}
interface IFQuestionState {
	testCases: number
	output: string
}
export class FQuestion extends React.Component<IFQuestionProps, IFQuestionState> {
	value: string = "";
	throttleRun: any;
	constructor() {
		super();
		this.state = {
			testCases: 0,
			output: ""
		}
		this.RUN = this.RUN.bind(this);
		this.showOutput = _.throttle(this.showOutput.bind(this), 10);
		this.runProgram = this.runProgram.bind(this);
	}
	componentDidMount() {
		this.RUN();
	}
	showOutput() {
		Runtime.run(this.value).then((val: string)=>{
			console.log(val);
			this.setState({...this.state, output: val});
		}).catch((val)=>{console.log(val);this.setState({...this.state, output: val})});
	}
	runProgram(value: string) {
		if (!value)
			return;
		this.value = value;
		this.showOutput();
	}
	RUN() {
		let promises = this.props.answers.map((answer)=>{
			return Runtime.runFunction(this.value, {name: this.props.funcName, input: answer.input});
		});
		let correctTestCases = 0;
		Promise.all(promises).then((results)=>{
			results.forEach((result, i)=>{
				if (result==this.props.answers[i].output) {
					correctTestCases++;
				}
			})
			this.setState({
				...this.state,
				testCases: correctTestCases
			})
			this.props.testCasesPassed?this.props.testCasesPassed(correctTestCases):null;
			setTimeout(this.RUN, 2000);
		}).catch(()=>{this.setState({...this.state, testCases: 0});setTimeout(this.RUN, 2000)});
	}
	render() {
		return <div className="card-0" style={{...this.props.style, padding: 10, backgroundColor: "white"}}>
			<div style={{padding: 10}}>
				{this.props.children}{" "}
				<span className="button" style={{display: 'inline-block'}} onClick={this.RUN}>Run Program</span>
			</div>
			<Monaco {...this.props.monaco} getOutput={this.runProgram}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				maxHeight: 100,
				backgroundColor: "white",
				fontFamily: "monospace",
				fontWeight: 900,
				overflow: "auto",
				color: (this.state.testCases==this.props.answers.length)?"darkgreen":"red"
			}}>
			{this.state.testCases}/{this.props.answers.length} test cases passed.
			</pre>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				height: 80,
				backgroundColor: "white",
				fontFamily: "monospace",
				color: "black",
				overflow: "auto"
			}}>
			{this.state.output}
			</pre>
		</div>;
	}
}