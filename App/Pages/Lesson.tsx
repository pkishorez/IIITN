import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from '../Monaco';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {Question, Practice} from './Questions/Question';
import {FQuestion} from './Questions/FQuestion';

interface IProps {};
interface IState {
	output: any
};

let Practices = [
	{
		description: "Console.log function accepts a string. When called with a string, prints on the console.",
		content: "console.log('Hello World.');"
	},
	{
		description: "When string contains '\\n' it's a new line.",
		content: "console.log('Hello World.\\nHello World.');"
	},
	{
		description: "Here is an example to print a pattern.",
		content: "console.log('*\\n**\\n***\\n****');"
	}
]

let Questions = [
	{
		question: "Write a program to print :",
		answer: "Hello World."
	},
	{
		question: "Write a program to print :",
		answer: "   *\n  ***\n *****\n*******"
	},
	{
		question: "Write a program to print :",
		answer: "*\n**\n***\n****"
	}
];

export class Lesson extends React.Component<IProps, IState> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			output: {}
		};
	}
	render() {
		return <Layout gutter={15} align="start">
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
				<h3>Console.Log</h3>
				Console.log is used to print the contents on the console.
				It accepts String.<br/>
				Let's Dive Into Hello World Program.

				{
					Practices.map((p, i)=>{
						return <div key={i}>
							<div style={{marginTop: 15}}>{p.description}</div>
							<Practice content={p.content}></Practice>
						</div>;
					})
				}

				<h3>Practice questions.</h3>
				{
					Questions.map((q, i)=>{
						return <div key={i}>
							<Question answer={q.answer}>{q.question}</Question>
						</div>;
					})
				}
				<FQuestion funcDetails={{
					name: "isPrime",
					inputs: [
						{input: [2], output: true},
						{input: [3], output: true},
						{input: [4], output: false}
				]}}>Write isPrime function to check if prime or not.</FQuestion>
			</Section>
		</Layout>;
	}
}