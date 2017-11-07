import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Flash} from 'classui/Components/Flash';
import {Layout, Section} from 'classui/Components/Layout';
import {Monaco} from '../../Monaco';
import {runProgramInNewScope} from '../../Monaco/Runtime';
import {compileCode} from '../../Monaco/Playground';
import * as _ from 'lodash';

interface IProps {};
interface IState {
	lesson: number
};

let lessons = [{
	desc: "Get reference to the canvas element in the DOM.",
	code: "let ref = document.getElementById('canvas');"
},
	{
	desc: "Initialize the canvas API with canvas DOM element ref to start drawing on it.",
	code: "let canvas = new Canvas(ref, true);"
}, {
	desc: "Create a new green Rectangle object and add to canvas at position 100 200.",
	code: `let rect = new Rectangle(20, 20, 'white');
canvas.addObject(rect);`
}, {
	desc: "Move the added rectangle to a new position 100, 200",
	code: "rect.moveTo(100, 100);"
}, {
	desc: "You are ready to play with canvas now!!!",
	code: "YOUR CODE :)"
}
];

export class PlaygroundCanvas2dStarter extends React.Component<IProps, IState> {
	componentDidMount() {
		Monaco.INIT(()=>{
			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: true,
				noSyntaxValidation: true
			});
			monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				...Monaco.typescriptDefaults.compilerOptions,
				noImplicitAny: false,
				noUnusedLocals: false
			});
			Flash.flash((dismiss)=>{
				let cwu = this.componentWillUnmount;			
				this.componentWillUnmount = ()=>{
					dismiss();
					cwu && cwu();
				}
				return <Lesson />
			}, true, true);
		})
	}
	render() {
		return null;
	}
};

class Lesson extends React.Component<IProps, IState> {
	_code = '';
	constructor() {
		super();
		this.state = {
			lesson: 0
		};
		this.run= _.throttle(this.run.bind(this), 100);
		this.runCode = this.runCode.bind(this);
	}

	run(code: string) {
		// Save code first.
		this._code = code;
		if (this.state.lesson==(lessons.length-1)) {
			return;
		}
		let checkCode = '';
		for (let i=0; i<=this.state.lesson; i++) {
			checkCode += lessons[i].code+'\n';
		}
		if (code==checkCode) {
			runProgramInNewScope(compileCode(code));
			this.setState({
				lesson: this.state.lesson+1
			});
		}
	}
	runCode() {
		runProgramInNewScope(compileCode(this._code));
	}

	render() {
		return <Layout gutter={20}>
			<Section width={600} card style={{overflow: "hidden"}}>
				<Layout>
					<Section remain>
						<h4 style={{margin: 15}}>Canvas2D Demo</h4>
					</Section>
					<Section>
						{this.state.lesson!=(lessons.length-1)?
						<h5>Step : <b>{this.state.lesson+1}/{lessons.length-1}</b></h5>:
						<button className="button" style={{float: 'right'}} onClick={this.runCode}>Run Code :)</button>
						}
					</Section>
				</Layout>
				<Monaco getOutput={this.run} height={300} lineNumbers="off" fontSize={18}/>
			</Section>
			<Section width={500}>
				<canvas id="canvas" height={300} width={500} style={{backgroundColor: 'black'}}></canvas>
				<div style={{backgroundColor: 'white', minHeight: 200, padding: 10, marginTop: 10}}>
					<h4>
						Step : {this.state.lesson+1}<br/>
					</h4>
					<p>
						{lessons[this.state.lesson].desc}
					</p>
					<div style={{backgroundColor: 'rgba(0, 0, 0, 0.1)',border: '1px solid grey', padding: 10 , fontFamily: 'monospace'}}>
						{lessons[this.state.lesson].code}
					</div>
				</div>
			</Section>
		</Layout>;
	}
}