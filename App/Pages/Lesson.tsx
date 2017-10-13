import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from '../Monaco';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {Question} from './Presentation/Question';

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
			<Section remain card>
				<h3>Console.Log</h3>
				Console.log is used to print the contents on the console.
				It accepts String.<br/>
				Let's Dive Into Hello World Program.

				<h3>Program #1</h3>
				<Question answer="Hello World">Write program to print.</Question>
				<h3>Program #2</h3>
				<Question answer="   *\n  ***\n *****\n********">Write program to print.</Question>
				<h3>Program #3</h3>
				<Question answer="*\n**\n***\n****">Write program to print.</Question>
				</Section>
		</Layout>;
	}
}