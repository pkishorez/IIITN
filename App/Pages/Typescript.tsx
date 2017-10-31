import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Flash} from 'classui/Components/Flash';
import {FQuestion, IFQuestionProps} from './Questions/FQuestion';

interface IProps {};
interface IState {};

let MarsQuestion = (props: any)=>{
	return <div>
		<h2 id="mars-rover-problem">Mars Rover problem:</h2>
		<p>A squad of robotic rovers are to be landed by NASA on a plateau on Mars.</p>
		<p>This plateau, which is curiously rectangular, must be navigated by the rovers so that their on-board cameras can get a complete view of the surrounding terrain to send back to Earth.</p>
		<p>A rover&rsquo;s position and location is represented by a combination of x and y co-ordinates and a letter representing one of the four cardinal compass points. The plateau is divided up into a grid to simplify navigation. An example position might be 0, 0, N, which means the rover is in the bottom left corner and facing North.</p>
		<p>In order to control a rover , NASA sends a simple string of letters. The possible letters are &lsquo;L&rsquo;, &lsquo;R&rsquo; and &lsquo;M&rsquo;. &lsquo;L&rsquo; and &lsquo;R&rsquo; makes the rover spin 90 degrees left or right respectively, without moving from its current spot. &lsquo;M&rsquo; means move forward one grid point, and maintain the same heading.</p>
		<p>Assume that the square directly North from (x, y) is (x, y 1).</p>
		<h3 id="input">INPUT:</h3>
		<p>Input consists of</p>
		<p>upper-right coordinates of the plateau</p>
		<p>the lower-left coordinates are assumed to be 0,0.</p>
		<p>rover&rsquo;s position,</p>
		<p>instructions containing the string of actions. 'L', 'R', 'M'</p>
		<div>
		<div>&nbsp;</div>
		<code style={{fontFamily: "monospace", color: "grey"}}>
			<div>interface IInput {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;plateauCoordinates: {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x: number,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y: number</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;roverPosition: {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x: number</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y: number</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;direction: "N" | "M" | "E" | "S"</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;instructions: string //contains characters 'L', 'R', 'M'</div>
			<div>}</div>
		</code>
		</div>
		<h3 id="output">OUTPUT:</h3>
		<p>The output for each rover should be its final co-ordinates and heading.</p>
		<code style={{fontFamily: "monospace", color: "grey"}}>
			<div>interface IOutput {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;x: number</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;y: number</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;direction: "N" | "M" | "E" | "S"</div>
			<div>}</div>
		</code>
		<h2>Example:</h2>
		<p><b>input</b></p>
		<div>
		<code style={{fontFamily: "monospace", color: "grey"}}>
			<div>{"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;plateauCoordinates: {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x: 5,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y: 5</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;},</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;roverPosition: {"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x: 1,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y: 2,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;direction: "N"</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;},</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;instructions: "LMLMLMLMM"</div>
			<div>}</div>
		</code>
		<br />
		<div><b>output</b></div>
		<div>&nbsp;</div>
		<code style={{fontFamily: "monospace", color: "grey"}}>
			<div>{"{"}</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;x: 1,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;y: 3,</div>
			<div>&nbsp;&nbsp;&nbsp;&nbsp;direction: "N"</div>
			<div>}</div>
		</code>
		</div>
	</div>;
};

let marsprogramcontent = `interface IOutput {
	x: number
	y: number
	direction: "N" | "M" | "E" | "S"
}
interface IInput {
	plateauCoordinates: {
		x: number,
		y: number
	}
	roverPosition: {
		x: number
		y: number
		direction: "N" | "M" | "E" | "S"
	}
	instructions: string
}
function main(input: IInput): IOutput
{
	return {
		x: 1,
		y: 2,
		direction: "N"
	}
}`;

let Migrate = [
	{
		description: <div style={{padding: 10}}>
			<MarsQuestion/>
		</div>,
		question: <FQuestion monaco={{height: `calc(100vh - 230px)`, content: marsprogramcontent}} funcDetails={{
			name: "main",
			inputs: [
				{input: [{
					plateauCoordinates: {
						x: 5,
						y: 5
					},
					roverPosition: {
						x: 1,
						y: 2,
						direction: "N"
					},
					instructions: "LMLMLMLMM"
				}], output: {
					x: 1,
					y: 3,
					direction: "N"
				}},
				{input: [{
					plateauCoordinates: {
						x: 5,
						y: 5
					},
					roverPosition: {
						x: 3,
						y: 3,
						direction: "E"
					},
					instructions: "MMRMMRMRRM"
				}], output: {
					x: 5,
					y: 1,
					direction: "E"
				}}
		]}}></FQuestion>
	}
]
export class Typescript extends React.Component<IProps, IState> {
	componentDidMount() {
		Flash.flash((dismiss)=>{
			let cwu = this.componentWillUnmount;
			this.componentWillUnmount = ()=>{
				dismiss();
				if (cwu)
					cwu();
			};
			return <Screen {...Migrate[0]}/>;
		}, true, true);
	}
	render() {
		return null;
	}
}

let Screen = (props: any)=>{
	return <Layout gutter={20} align="center">
		<Section width={580} remain style={{overflow: "hidden"}}>
			{props.question}
		</Section>
		<Section width={500} card style={{overflow: "auto", height: `calc(100vh - 100px)`}}>{props.description}</Section>
	</Layout>;
}