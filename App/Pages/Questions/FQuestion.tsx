import * as React from 'react';
import {Monaco, IMonacoProps} from '../../Monaco';
import {IFunction, Runtime} from '../../Monaco/Runtime';
import {SeqProgramOutput} from '../../Monaco/SeqProgramOutput';
import * as _ from 'lodash';

export interface IFQuestionProps {
	funcDetails: IFunction
	testCasesPassed?: (num: number)=>void
	style?: React.CSSProperties
	monaco?: IMonacoProps
}
interface IFQuestionState {
	testCases: number
	output: string
	testCaseMessage: string
}
export class FQuestion extends React.Component<IFQuestionProps, IFQuestionState> {
	value: string = "";
	throttleRun: any;
	showOutput: SeqProgramOutput|null;
	constructor() {
		super();
		this.state = {
			testCases: 0,
			testCaseMessage: "",
			output: ""
		}
		this.RUN = _.throttle(this.RUN.bind(this), 1000);
		this.runProgram = this.runProgram.bind(this);
	}
	componentDidMount() {
		this.RUN();
	}
	runProgram(value: string) {
		if (!value)
			return;
		this.value = value;
		this.showOutput && this.showOutput.runProgram(value);
		this.RUN();
	}
	RUN() {
		this.setState({
			testCaseMessage: "Checking..."
		})
		Runtime.runFunction(this.value, this.props.funcDetails).then((data)=>{
			let correct = 0;
			let correctAnswers = _.map(this.props.funcDetails.inputs, (answer)=>(answer.output));
			for (let i=0; i<correctAnswers.length; i++) {
				if (data.outputs[i]==correctAnswers[i]) {
					correct++;
				}
			}
			this.setState({
				...this.state,
				testCases: correct,
				testCaseMessage: "Done :)"
			});
		}).catch((msg)=>{
			this.setState({
				...this.state,
				testCases: 0,
				testCaseMessage: msg
			})
		});
	}
	render() {
		return <div className="card-0" style={{...this.props.style, padding: 10, backgroundColor: "white"}}>
			<div style={{padding: 10}}>
				{this.props.children}{" "}
				<span className="button" style={{display: 'inline-block'}} onClick={this.RUN}>Run Program</span>
			</div>
			<Monaco {...this.props.monaco} getOutput={this.runProgram}/>
			<div className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				backgroundColor: "white",
				fontFamily: "monospace",
				fontWeight: 900,
				overflow: "auto",
				color: (this.state.testCases==this.props.funcDetails.inputs.length)?"darkgreen":"red"				
			}}>
			{this.state.testCaseMessage}<br/>
			{this.state.testCases}/{this.props.funcDetails.inputs.length} test cases passed.
			</div>
			<SeqProgramOutput throttle={10} ref={(ref)=>{this.showOutput=ref}}/>
		</div>;
	}
}