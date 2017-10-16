import * as React from 'react';
import {Monaco} from '../../Monaco';

interface IQuestionProps {
	answer: string
}
interface IQuestionState {
	output: any
}
export class Question extends React.Component<IQuestionProps, any> {
	constructor() {
		super();
		this.state = {
			output: {}
		}
	}
	render() {
		let correctAnswer = this.state.output.data==this.props.answer;
		return <div className="card-0" style={{margin: 15,padding: 10, backgroundColor: "white"}}>
			<div style={{padding: 10}}>
				{this.props.children}
				<pre style={{fontFamily: "monospace", color: "darkgreen", lineHeight: 1, marginTop: 10}}>{this.props.answer}</pre>
			</div>
			<Monaco processOutput={(output)=>this.setState({output})}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				maxHeight: 300,
				backgroundColor: correctAnswer?"darkgreen":"red",
				fontFamily: "monospace",
				fontWeight: 900,
				color: 'white'
			}}>{this.state.output.data}</pre>
		</div>;
	}
}

interface IPracticeProps{
	content: string
}
interface IPracticeState {
	output: any
}
export class Practice extends React.Component<IPracticeProps, IPracticeState> {
	constructor() {
		super();
		this.state = {
			output: {}
		}
	}
	render() {
		return <div className="card-0" style={{margin: 15,padding: 10, backgroundColor: "white"}}>
			<Monaco height={50} diffContent={{content: this.props.content}} processOutput={(output)=>this.setState({output})}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				maxHeight: 200,
				overflow: "auto",
				backgroundColor: "white",
				fontFamily: "monospace",
				color: 'black'
			}}>{this.state.output.data}</pre>
		</div>;
	}
}