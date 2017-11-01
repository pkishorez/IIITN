import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from '../../Monaco';
import {compileCode} from '../../Monaco/Playground';
import {runProgram} from '../../Monaco/Runtime';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item} from 'classui/Components/Menu';
import {Flash} from 'classui/Components/Flash';
import * as _ from 'lodash';

interface IProps {};
interface IState {
	loaded: boolean
	code: string
};

let defaultCode = `import {Canvas} from 'canvas2d';
import {Rectangle, Circle, Shape, CustomShape} from 'canvas2d/Shapes';

let canvasElem = document.getElementById("canvas") as HTMLCanvasElement;
canvasElem.width = 500;
canvasElem.height = 400;
canvasElem.style.backgroundColor = "white";

let canvas = new Canvas(canvasElem, true);

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

export class PG2D extends React.Component<IProps, IState> {
	constructor() {
		super();
		let savedCode = localStorage.getItem("PG2D");
		if (savedCode && savedCode.trim()=="") {
			savedCode = null;
		}
		this.state = {
			loaded: false,
			code: savedCode?savedCode:defaultCode
		};
		this.saveCode = _.throttle(this.saveCode.bind(this), 500, {
			leading: true,
			trailing: true
		});
		this.runCode = this.runCode.bind(this);
		fetch("/assets/canvas2d/Canvas_bundled.d.ts").then((res)=>{
			let def = res.text().then((data)=>{
				Monaco.INIT(()=>{
					monaco.languages.typescript.typescriptDefaults.addExtraLib(data);
					monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
						...Monaco.typescriptDefaults.compilerOptions,
						noUnusedLocals: false,
						noUnusedParameters: false
					});
					this.setState({
						loaded: true
					});
				})
			});
		}).catch((err)=>console.log(err));
	}
	saveCode(code: string) {
		this.setState({
			code
		});
		localStorage.setItem("PG2D", code);
	}
	runCode() {
		let code = this.state.code.replace(/^import [^\n]*/g, "");
		code = code.replace(/^[\n]import [^\n]*/g, "");
		code = `(function(){
			${code}
		}())`;
		if (document.getElementById("canvas")) {
			runProgram(compileCode(code));
		}
		else {
			Flash.flash((dismiss)=>{
				return <Canvas runCode={()=>{
					runProgram(compileCode(code));				
				}}/>
			});	
		}
	}
	render() {
		let code = this.state.code;
		return <Layout align="center" style={{height: `calc(100vh - 50px)`}} gutter={20}>
			<Section width={750}>
				{this.state.loaded?
					<Monaco content={code as string} ctrlEnterAction={this.runCode} height={`calc(100vh - 100px)`} getOutput={this.saveCode}/>:
					<div>Loading...</div>
				}
			</Section>
			<Section remain>
				<Menu header="Canvas Playground">
					<div className="button card-3" onClick={this.runCode}>Run (Ctrl+Enter)</div>
				</Menu>
			</Section>
		</Layout>;
	}
}

interface ICanvasProps {
	runCode: any
}
class Canvas extends React.Component<ICanvasProps> {
	componentDidMount() {
		this.props.runCode();
	}
	render() {
		return <canvas id="canvas" width={300} height={250}></canvas>;
	}
}