import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {runProgramInNewScope} from 'App/Monaco/Runtime/';
import {CanvasView, canvasDefaultCode} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item} from 'classui/Components/Menu';
import {Flash} from 'classui/Components/Flash';
import * as _ from 'lodash';

interface IProps {};
interface IState {};

let defaultCode = `${canvasDefaultCode}

function move(o: any, speed: number)
{
	o.moveTo(Math.random()*canvas.width, Math.random()*canvas.height, speed, ()=>{
		move(o, speed);
	});
}
let circle: Shape = new Circle(10, "red").setPosition(0, 0);
move(circle, 0.5);

for (let i=0; i<40; i++) {
	let rect: Shape = new Rectangle(10, 10, "green").setPosition(0, 0);
	canvas.addObject(rect);
	move(rect, 1);
}
for (let i=0; i<40; i++) {
	let circle: Shape = new Circle(5, "green").setPosition(0, 0);
	canvas.addObject(circle);
	move(circle, 1);
}

let cshape: Shape = new CustomShape([{x: 30, y: 0}, {x: 30, y: 30}, {x: 20, y: 5}, {x: 0, y: 0}, {x: 0, y: 30}, {x: 30, y: 30}, {x: 5, y: 20}, {x: 0, y: 0}], "red").moveTo(100, 100);
canvas.addObject(cshape);
move(cshape, 0.3);`;

export class PlaygroundCanvas2D extends React.Component<IProps, IState> {
	editorRef: monaco.editor.IStandaloneCodeEditor;
	constructor(props: any, context: any) {
		super(props, context);
		this.runCode = this.runCode.bind(this);
	}
	saveCode(code: string) {
		this.setState({
			code
		});
	}
	runCode() {
		Flash.flash((dismiss)=>{
			return <CanvasView  width={300} height={250} code={this.editorRef.getValue()} />
		});
	}
	render() {
		return <Layout align="center" style={{height: `calc(100vh - 50px)`}} gutter={20}>
			<Section width={750}>
				<PersistMonaco id="PG2D" dimensions={{
					height: `calc(100vh - 100px)`
				}}  defaultContent={defaultCode} ctrlEnterAction={this.runCode} editorRef={(ref: any)=>this.editorRef=ref}/>:
			</Section>
			<Section remain>
				<Menu header="Canvas Playground">
					<div className="button card-3" onClick={this.runCode}>Run (Ctrl+Enter)</div>
				</Menu>
			</Section>
		</Layout>;
	}
}