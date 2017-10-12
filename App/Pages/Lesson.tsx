import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from '../Monaco';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';

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
		return <Layout c_props={{card: false}} gutter={15} align="start">
			<Section minWidth={225}>
				<Menu header="Lessons">
					<Item>1. Working with Console.</Item>
					<Item>2. Variables</Item>
					<Item>3. Conditionals</Item>
					<Item>4. Loops</Item>
					<Item>5. Functions</Item>
					<div className="button">Kishore</div>
				</Menu>
			</Section>
			<Section remain>
				<Question answer={`   *\n  ***\n *****\n*******`}>Write a program to print 5 base Pyramid. like</Question>
			</Section>
		</Layout>;
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
			<div className="card-2" style={{padding: 10}}>
				{this.props.children}
				<pre style={{fontFamily: "monospace", color: "darkgreen", lineHeight: 1, marginTop: 10}}>{this.props.answer}</pre>
			</div>
			<Monaco processOutput={(output)=>this.setState({output})}/>
			<pre className="card-0" style={{
				padding: 10,
				transition: "0.3s all",
				maxHeight: 300,
				backgroundColor: (this.state.output.data==this.props.answer)?"#D0FFD0":"#FFE1E1",
				fontFamily: "monospace",
				color: this.state.output.type=="error"?'red':'black'
			}}>{this.state.output.data}</pre>
		</div>;
	}
}