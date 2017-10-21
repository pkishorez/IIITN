import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from '../Monaco';
import {Runtime} from '../Monaco/Runtime';
import {Layout, Section} from 'classui/Components/Layout';
import * as _ from 'lodash';

interface IProps {
	monaco?: IMonacoProps
};
interface IState {
	output: string
};

let output_seq = 0
export class Playground extends React.Component<IProps, IState> {
	constructor()
	{
		super();
		this.state = {
			output: ""
		};
		this.runProgram = _.throttle(this.runProgram.bind(this), 100);
		this.saveContent = _.debounce(this.saveContent.bind(this), 500, {
			trailing: true,
			leading: true
		});
	}
	saveContent(value: string) {
		if (value){
			localStorage.setItem("PLAYGROUND", value);			
		}
	}
	runProgram(value: string)
	{
		this.saveContent(value);
		let program_seq_no = output_seq+1;
		Runtime.run(value).then((val: string)=>{
			output_seq++;
			// Program output outdated.
			if (program_seq_no<output_seq){
				return;
			}
			this.setState({
				...this.state,
				output: val
			});
		}).catch((val)=>{
			output_seq++;
			if (program_seq_no<output_seq){
				return;
			}
			this.setState({
				...this.state,
				output: val
			});
		});

	}
	render() {
		let oldContent = localStorage.getItem("PLAYGROUND");
		let monacoprops: IMonacoProps = {
			...this.props.monaco,
			content: oldContent?oldContent:""
		};
		return <Layout align="center" style={{height: "calc(100vh - 50px)"}} gutter={10}>
			<Section remain>
				<Monaco {...monacoprops} fontSize={15} height="calc(100vh - 150px)" getOutput={this.runProgram}/>
			</Section>
			<Section width={400} card>
				<h3 style={{textAlign: "center"}}>Output</h3>
				<pre className="card-0" style={{
					padding: 10,
					transition: "0.3s all",
					height: `calc(100vh - 150px)`,
					backgroundColor: "white",
					fontFamily: "monospace",
					color: "black",
					overflow: "auto"
				}}>
				{this.state.output}
				</pre>
			</Section>
		</Layout>;
	}
};