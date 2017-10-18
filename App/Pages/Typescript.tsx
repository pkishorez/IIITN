import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Flash} from 'classui/Components/Flash';
import {FQuestion, IFQuestionProps} from './Questions/FQuestion';

interface IProps {};
interface IState {};

let Migrate = [
	{
		description: <div style={{padding: 10}}>
			<h3>Prime Number Program</h3>
			Write a program to return nth prime number.
		</div>,
		question: <FQuestion funcName="nthPrime" monaco={{height: 300, content: `function nthPrime(num)\n{\n\tlet nprime = 2;\n\treturn nprime;\n}`}} answers={[
			{input: [1], output: 2},
			{input: [10], output: 29},
			{input: [20], output: 71},
			{input: [30], output: 113},
			{input: [40], output: 173}
		]}>Write program to return nth prime number.</FQuestion>
	}
]
export class Typescript extends React.Component<IProps, IState> {
	componentDidMount() {
		Flash.flash((dismiss)=>{
			return <Screen {...Migrate[0]}/>;
		}, true, true);
	}
	render() {
		return null;
	}
}

let Screen = (props: any)=>{
	return <Layout gutter={20} align="center">
		<Section width={400} card>{props.description}</Section>
		<Section width={580} remain style={{overflow: "hidden"}}>
			{props.question}
		</Section>
	</Layout>;
}