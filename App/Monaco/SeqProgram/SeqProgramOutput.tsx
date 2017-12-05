import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Runtime} from '../Runtime/';
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
	constructor(props: any, context: any) {
		super(props, context);
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
		return <div className="card-1" style={{
			transition: "0.3s all",
			backgroundColor: "black",
			overflow: "auto",
			width: "100%",
			...this.props.style
		}}>
			<pre style={{
				whiteSpace: "pre",
				overflowX: "hidden",
				fontSize: 14,
				fontWeight: 900,
				fontFamily: "Inconsolata, monospace",
				padding: 20,
				margin:0,
				lineHeight: 1.6,
				backgroundColor: 'black',
				color: 'cyan'
			}}>{this.state.output}</pre>
		</div>
	}
}