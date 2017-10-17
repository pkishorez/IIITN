import * as React from 'react';
import {Monaco} from '../../Monaco';
import {IFunction, Runtime} from '../../Monaco/Runtime';
import * as _ from 'lodash';

interface IFQuestionProps {
	funcName: string
	answers: {
		input: any[],
		output: any
	}[]
}
interface IFQuestionState {
	testCases: number
}
export class FQuestion extends React.Component<IFQuestionProps, IFQuestionState> {
	constructor() {
		super();
		this.state = {
			testCases: 0
		}
		this.runProgram = this.runProgram.bind(this);
		this.runProgram = _.debounce(this.runProgram, 2000, {
			leading: true,
			trailing: true
		});
	}
	runProgram(value: string) {
		let totalTestCases = this.props.answers.length;
		let promises = this.props.answers.map((answer)=>{
			return Runtime.runFunction(value, {name: this.props.funcName, input: answer.input});
		});
		let correctTestCases = 0;
		Promise.all(promises).then((results)=>{
			results.forEach((result, i)=>{
				if (result==this.props.answers[i].output) {
					correctTestCases++;
				}
			})
			this.setState({
				testCases: correctTestCases
			})
		});
	}
	render() {
		return <div className="card-0" style={{margin: 15,padding: 10, backgroundColor: "white"}}>
			<div style={{padding: 10}}>
				{this.props.children}
			</div>
			<Monaco getOutput={this.runProgram}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				maxHeight: 300,
				backgroundColor: "white",
				fontFamily: "monospace",
				fontWeight: 900,
				color: (this.state.testCases==this.props.answers.length)?"darkgreen":"red"
			}}>
			{this.state.testCases}/{this.props.answers.length} test cases passed.
			</pre>
		</div>;
	}
}