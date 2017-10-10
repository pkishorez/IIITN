import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from '../Monaco';

interface IProps {};
interface IState {
	output: any
};

export class Lesson extends React.Component<IProps, IState> {
	constructor() {
		super();
		this.state = {
			output: {}
		};
	}
	render() {
		return <div>
			<Question answer={`   *\n  ***\n *****\n*******`}>Write a program to print 5 base Pyramid. like</Question>
		</div>;
	}
}

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
		return <div className="card-2" style={{padding: 10, backgroundColor: "white"}}>
			{this.props.children}
			<pre style={{fontFamily: "monospace", lineHeight: 1}}>{this.props.answer}</pre>
			<Monaco processOutput={(output)=>this.setState({output})}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				backgroundColor: (this.state.output.data==this.props.answer)?"#D0FFD0":"#FFE1E1",
				fontFamily: "monospace",
				color: this.state.output.type=="error"?'red':'black'
			}}>{this.state.output.data}</pre>
		</div>;
	}
}