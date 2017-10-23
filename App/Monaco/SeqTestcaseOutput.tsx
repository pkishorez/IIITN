import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Runtime, IFunction} from './Runtime';
import * as _ from 'lodash';

interface IProps {
	style?: React.CSSProperties
	throttle?: number
	funcDetails: IFunction
};
interface IState {
	testCases: number
	message: string
};

export class SeqTestcaseOutput extends React.Component<IProps, IState> {
	private output_seq = 0;
	static defaultProps = {
		throttle: 10
	};
	constructor()
	{
		super();
		this.state = {
			message: "",
			testCases: 0
		}
	}
	compnentDidMount() {
		this.runProgram = _.throttle(this.runProgram.bind(this), this.props.throttle);		
	}
	runProgram(code: string)
	{
		let program_seq_no = this.output_seq+1;
		this.setState({
			...this.state,
			message: "Running..."
		})
		Runtime.runFunction(code, this.props.funcDetails).then((outputs: any[])=>{
			this.output_seq++;
			if (program_seq_no<this.output_seq) {
				// Output outdated.
				return;
			}
			let correct = 0;
			let correctAnswers = _.map(this.props.funcDetails.inputs, (answer)=>(answer.output));
			for (let i=0; i<correctAnswers.length; i++) {
				if (outputs[i]==correctAnswers[i]) {
					correct++;
				}
			}
			this.setState({
				...this.state,
				testCases: correct,
				message: "Done."
			});
		}).catch((msg: string)=>{
			this.setState({
				...this.state,
				testCases: 0,
				message: msg
			})
		});
	}
	render() {
		return 	<div className="card-0" style={{
			padding: 10,
			transition: "0.3s all",
			backgroundColor: "white",
			fontFamily: "monospace",
			color: (this.state.testCases==this.props.funcDetails.inputs.length)?"darkgreen":"red",
			...this.props.style
		}}>
			<b>{this.state.testCases}/{this.props.funcDetails.inputs.length} test cases passed.</b> {" "+this.state.message}
		</div>;
	}
}