import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Runtime, IFunctionDetails} from '../Runtime/Tasks/';
import * as _ from 'lodash';

interface IProps {
	debounce?: number
	funcDetails: IFunctionDetails
	onOutput?: (output: {
		output: string
		testcasesPassed: number
	})=>void
	onError?: (error: string)=>void
};

export class SeqTestcaseOutput{
	private output_seq = 0;
	private props: IProps;

	constructor(props: IProps) {
		this.props = props;
		this.runProgram = _.debounce(this.runProgram.bind(this), this.props.debounce, {
			trailing: true,
			leading: true
		});
	}
	runProgram(code: string)
	{
		let program_seq_no = this.output_seq+1;
		Runtime.runFunctionTestCases(code, this.props.funcDetails).then((data)=>{
			this.output_seq++;
			if (program_seq_no<this.output_seq) {
				// Output outdated.
				return;
			}
			let correct = 0;
			let correctAnswers = _.map(this.props.funcDetails.tests, (answer)=>(answer.output));
			for (let i=0; i<correctAnswers.length; i++) {
				if (_.isEqual(data.outputs[i], correctAnswers[i])) {
					correct++;
				}
			}
			this.props.onOutput?this.props.onOutput({
				output: data.data,
				testcasesPassed: correct
			}):null;
		}).catch((error: string)=>{
			this.props.onError?this.props.onError(error):null;
		});
	}
}