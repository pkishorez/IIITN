import * as React from 'react';
import {Monaco, IMonacoProps} from '../../Monaco';
import {IFunction, Runtime} from '../../Monaco/Runtime/';
import {SeqProgramOutput, SeqTestcaseOutput} from '../../Monaco/SeqProgram/';
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
	runTestCases: SeqTestcaseOutput|null;
	constructor() {
		super();
		this.state = {
			testCases: 0,
			testCaseMessage: "",
			output: ""
		}
		this.runProgram = this.runProgram.bind(this);
	}
	runProgram(value: string) {
		if (!value)
			return;
		this.value = value;
		this.showOutput && this.showOutput.runProgram(value);
		this.runTestCases && this.runTestCases.runProgram(value);
	}
	render() {
		return <div className="card-0" style={{...this.props.style, padding: 10, backgroundColor: "white"}}>
			{this.props.children?<div style={{padding: 10}}>
				{this.props.children}{" "}
			</div>:null}
			<Monaco {...this.props.monaco} getOutput={this.runProgram}/>
			<SeqTestcaseOutput debounce={50} ref={(ref)=>{this.runTestCases=ref}} funcDetails={this.props.funcDetails}/>
			<SeqProgramOutput debounce={50} style={{height: 50}} ref={(ref)=>{this.showOutput=ref}}/>
		</div>;
	}
}