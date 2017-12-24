import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import {Runtime} from 'App/Monaco/Runtime/';
import {SeqProgramOutput} from 'App/Monaco/SeqProgram';
import {Layout, Section} from 'classui/Components/Layout';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import * as _ from 'lodash';
import { Flash } from 'classui/Components/Flash';

interface IProps {
	monaco?: IMonacoProps
	width?: string | number
	mainHeight?: string | number
	playHeight?: string | number
	outputHeight?: string | number
};
interface IState {
	running: boolean
	output: string
	error?: string
};

export class PlaygroundTypescript extends React.Component<IProps, IState> {
	seqProgram: SeqProgramOutput|null;
	static defaultProps: IProps = {
		width: "100%",
		playHeight: "calc(100vh - 150px)",
		outputHeight: "calc(100vh - 150px)",
		mainHeight: "calc(100vh - 50px)",
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.runProgram = this.runProgram.bind(this);
		this.state = {
			running: false,
			output: ""
		};
		this.seqProgram = new SeqProgramOutput({
			onOutput: (output)=>{
				this.setState({
					output,
					running: false,
					error: undefined
				})
			},
			onError: (error)=>{
				this.setState({
					running: false,
					error
				})
			}
		});
	}
	runProgram(value: string)
	{
		this.setState({
			running: true
		});
		this.seqProgram?this.seqProgram.runProgram(value):null;
	}
	render() {
		let output_lines = this.state.output.split("\n");
		let output = output_lines.map((text, i)=>{
			return <span key={i}>
				{text}
				{((output_lines.length-1)!=i)?
				<span style={{opacity: 0.3, whiteSpace: "pre"}}>⏎{"\n"}</span>:null}
			</span>
		});
		return <Layout gutter={20} align="center" style={{height: this.props.mainHeight, width: this.props.width}}>
			<Section remain>
				<PersistMonaco id="PLAYGROUND" {...this.props.monaco} fontSize={15} dimensions={{
					height: this.props.playHeight
				}} getOutput={this.runProgram}/>
			</Section>
			<Section basis={400} style={{maxWidth: 400, overflow: "auto"}}>
				<div className="card-1" style={{
					transition: "0.3s all",
					backgroundColor: "black",
					overflow: "auto",
					width: "100%",
					maxHeight: this.props.outputHeight,
					minHeight: 200
				}}>
					<pre style={{
						whiteSpace: "pre",
						fontSize: 15,
						fontWeight: 900,
						fontFamily: "Inconsolata, monospace",
						padding: 20,
						margin:0,
						lineHeight: 1.6,
						opacity: this.state.running?0.5:1,
						backgroundColor: 'black',
						color: this.state.error?'red':'cyan'
					}}>{this.state.error?this.state.error:output}</pre>
				</div>
			</Section>
		</Layout>;
	}
};

export let FlashPlaygroundTypescript = ()=>{
	Flash.flash(()=>{
		return <PlaygroundTypescript width={1024} playHeight="calc(100vh - 150px)" mainHeight="auto" outputHeight="calc(100vh - 200px)"/>;
	}, true, true, false);
}