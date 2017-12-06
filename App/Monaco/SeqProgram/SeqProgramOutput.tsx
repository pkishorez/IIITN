import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Runtime} from '../Runtime/Tasks/';
import * as _ from 'lodash';

interface IProps {
	debounce?: number
	onOutput?: (output: string)=>void
	onError?: (error: string)=>void
};

export class SeqProgramOutput{
	private output_seq = 0;
	private props: IProps;
	constructor(props: IProps) {
		this.props = {
			debounce: 100,
			...props
		};
		this.runProgram = _.debounce(this.runProgram.bind(this), this.props.debounce, {
			leading: true,
			trailing: true
		});
	}
	runProgram(code: string)
	{
		let program_seq_no = this.output_seq+1;
		Runtime.run(code).then((output: string)=>{
			this.output_seq++;
			// Program output outdated.
			if (program_seq_no<this.output_seq){
				return;
			}
			this.props.onOutput && this.props.onOutput(output);
		}).catch((error: string)=>{
			this.output_seq++;
			if (program_seq_no<this.output_seq){
				return;
			}
			this.props.onError && this.props.onError(error);
		});
	}
}