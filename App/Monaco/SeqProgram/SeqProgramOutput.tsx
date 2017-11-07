import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Runtime} from '../Runtime';
import * as _ from 'lodash';

interface IProps {
	style?: React.CSSProperties
	debounce?: number
};
interface IState {
	output: string
};

export class SeqProgramOutput extends React.Component<IProps, IState> {
	private output_seq = 0;
	static defaultProps = {
		throttle: 10
	};
	constructor()
	{
		super();
		this.state = {
			output: ""
		}
	}
	componentDidMount() {
		this.runProgram = _.debounce(this.runProgram.bind(this), this.props.debounce, {
			trailing: true,
			leading: true
		});
	}
	runProgram(code: string)
	{
		let program_seq_no = this.output_seq+1;
		Runtime.run(code).then((val: string)=>{
			this.output_seq++;
			// Program output outdated.
			if (program_seq_no<this.output_seq){
				return;
			}
			this.setState({
				...this.state,
				output: val
			});
		}).catch((val: string)=>{
			this.output_seq++;
			if (program_seq_no<this.output_seq){
				return;
			}
			this.setState({
				...this.state,
				output: val
			});
		});
	}
	render() {
		return 	<pre className="card-0" style={{
			padding: 10,
			transition: "0.3s all",
			height: 100,
			backgroundColor: "white",
			fontFamily: "monospace",
			color: "black",
			overflow: "auto",
			...this.props.style
		}}>
			{this.state.output}
		</pre>;
	}
}