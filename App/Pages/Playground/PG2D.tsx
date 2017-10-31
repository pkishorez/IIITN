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

let defaultCode = `import {Canvas} from 'Canvas';
import {Rectangle, Circle} from 'Canvas/Shapes';

let canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvasElement.width = 500;
canvasElement.height = 400;
canvasElement.style.backgroundColor = "white";

let canvas = new Canvas(canvasElement, true);

let circle = new Circle(10, "red").setPosition(100, 200);
let rect = new Rectangle(20, 20, "green").setPosition(100, 100);

canvas.addObject(circle);
canvas.addObject(rect);`;

export class PG2D extends React.Component<IProps, IState> {
	constructor() {
		super();
		let savedCode = localStorage.getItem("PG2D");
		this.state = {
			loaded: false,
			code: savedCode?savedCode:defaultCode
		};
		this.saveCode = _.throttle(this.saveCode.bind(this), 500, {
			leading: true,
			trailing: true
		});
		this.runCode = this.runCode.bind(this);
		fetch("/assets/canvas/Canvas_bundled.d.ts").then((res)=>{
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
		return <Layout align="start" style={{height: `calc(100vh - 50px)`}} gutter={20}>
			<Section width={750}>
				<Monaco content={code as string} ctrlEnterAction={this.runCode} height={`calc(100vh - 100px)`} getOutput={this.saveCode}/>
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