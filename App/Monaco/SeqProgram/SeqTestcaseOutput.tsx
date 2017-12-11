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
	private program_seq_no = 0;
	private last_output_seq_no = -1;
	private props: IProps;

	constructor(props: IProps) {
		this.props = props;
		this.runProgram = _.debounce(this.runProgram.bind(this), this.props.debounce, {
			trailing: true,
			leading: true
		})
	}
	runProgram(code: string):  Promise<{
		output: string
		testcasesPassed: number
	}>
	{
		let program_seq_no = this.program_seq_no++;
		return Runtime.runFunctionTestCases(code, this.props.funcDetails).then((data)=>{
			let correct = 0;
			let correctAnswers = _.map(this.props.funcDetails.tests, (answer)=>(answer.output));
			for (let i=0; i<correctAnswers.length; i++) {
				if (_.isEqual(data.outputs[i], correctAnswers[i])) {
					correct++;
				}
			}

			let output = {
				output: data.data,
				testcasesPassed: correct
			};
			if (this.last_output_seq_no>program_seq_no) {
				// Output outdated.
				return output;
			}
			this.last_output_seq_no = program_seq_no;
			this.props.onOutput?this.props.onOutput(output):null;
			return output;
		}).catch((error: string)=>{
			if (this.last_output_seq_no>program_seq_no) {
				// Error too outdated.
				return Promise.reject(error);
			}
			this.last_output_seq_no = program_seq_no;
			this.props.onError?this.props.onError(error):null;
			return Promise.reject(error);
		}) as any;
	}
}