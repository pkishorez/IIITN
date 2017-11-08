import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CanvasMonaco} from '../Monaco/CanvasMonaco';
import {runProgramInNewScope} from '../Monaco/Runtime/';
import {compileCode} from '../Monaco/Runtime/typescript';
import {CompileCanvasCode, canvasElemId} from '../Monaco/Runtime/canvas';
import {runProgram} from '../Monaco/Runtime/';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import * as _ from 'lodash';
import {Form, Text} from 'classui/Components/Form';
import {SocketIO} from '../SocketIO';
import {connect} from 'react-redux';
import {IRootState, A_Task, store} from '../State';
import {Task as TaskAction} from '../User';
import {ITask} from '../State/TaskReducer';

interface IProps {
	tasks: IRootState["tasks"]
};
interface IState {
	currentTaskNum: number
	currentTask: string
	question: string
	
};

let defaultCode = `import {Canvas} from 'canvas2d';
import {Rectangle, Circle, Shape, CustomShape} from 'canvas2d/Shapes';

let canvasElem = document.getElementById("${canvasElemId}") as HTMLCanvasElement;
canvasElem.width = 500;
canvasElem.height = 400;
canvasElem.style.backgroundColor = "white";

let canvas = new Canvas(canvasElem, true);
`;

class Task_ extends React.Component<IProps, IState>{
	editorRef: monaco.editor.IStandaloneDiffEditor;
	dropdown: Dropdown;
	constructor() {
		super();
		this.state = {
			currentTaskNum: 0,
			currentTask: "",
			question: ""
		};
		this.loadTask = this.loadTask.bind(this);
		this.save = this.save.bind(this);
		this.resetCode = this.resetCode.bind(this);
		this.saveBuffer = _.debounce(this.saveBuffer.bind(this), 200);
		this.runCode = this.runCode.bind(this);
		this.loadSavedCode = this.loadSavedCode.bind(this);
		this.runFullScreen = this.runFullScreen.bind(this);
	}
	componentDidMount() {
		TaskAction.get().then((ts)=>{
			let storedTasks = store.getState().tasks;
			let tasks: IRootState["tasks"] = {};
			// Compute tasks from ts.
			ts.mainTasks.map((t: any)=>{
				tasks[t._id] = {
					question: t.question,
					resetCode: t.resetCode,
					saved: ts.userTasks[0].tasks[t._id]
				}
			});
			for (let i of _.difference(Object.keys(storedTasks), Object.keys(tasks))) {
				delete storedTasks[i];
			}
			store.dispatch(A_Task.init(_.merge(storedTasks, tasks)));
		});
	}
	loadTask(taskNum: number, id: string) {
		let task = this.props.tasks[id];
		let code = task.buffer?task.buffer:task.saved;
		code = code?code:task.resetCode;
		code = code?code:defaultCode;

		this.editorRef.getOriginalEditor().setValue(task.resetCode?task.resetCode:"\n");
		this.editorRef.getModifiedEditor().setValue(code);
		this.setState({
			currentTaskNum: taskNum,
			currentTask: id
		});
		this.dropdown.dismiss();
		console.log(task.question);
		runProgramInNewScope(CompileCanvasCode(task.question, "c_tcanvas"));
		let tc = (document.getElementById("tcanvas") as HTMLCanvasElement);
		tc.width = 400;
		tc.height = 250;
		// Load the question in tcanvas. TODO
	}
	save() {
		TaskAction.save(this.state.currentTask, this.editorRef.getModifiedEditor().getValue()).then(alert).catch(alert);
		store.dispatch(A_Task.save(this.state.currentTask, this.editorRef.getModifiedEditor().getValue()));
	}
	loadSavedCode() {
		let code = this.props.tasks[this.state.currentTask];
		let scode = code.saved?code.saved:"\n";
		this.editorRef.getModifiedEditor().setValue(scode);
	}
	resetCode() {
		let code = this.props.tasks[this.state.currentTask];
		let scode = code.resetCode;
		scode = scode?scode: defaultCode;
		this.editorRef.getModifiedEditor().setValue(scode);
	}
	saveBuffer(value: string) {
		store.dispatch(A_Task.saveBuffer(this.state.currentTask, value?value:""));
	}
	runCode() {
		runProgramInNewScope(CompileCanvasCode(this.editorRef.getModifiedEditor().getValue(), "c_ycanvas"));
	}
	runFullScreen() {
		Flash.flash((dismiss)=>{
			return <canvas id="c_fullscreen" width={600} height={500} ref={()=>{
				runProgramInNewScope(CompileCanvasCode(this.editorRef.getModifiedEditor().getValue(), "c_fullscreen"));				
			}}></canvas>;
		}, false, true);
	}
	render() {
		let tasks = [], index = 0;
		for (let i in this.props.tasks) {
			index++;
			let ind = index;
			tasks.push(<li key={i} onClick={()=>this.loadTask(ind, i)}>Task - {index}</li>);
		}
		return <Layout align="center" gutter={20} style={{height: `calc(100vh - 50px)`}}>
			<Section remain>
				<CanvasMonaco diffContent={{content: ""}} content="" ctrlEnterAction={this.runCode} height={`calc(100vh - 100px)`} getOutput={this.saveBuffer} editorRef={(ref)=>(this.editorRef as any)=ref}/>
			</Section>
			<Section minWidth={402} style={{maxHeight: `calc(100vh - 50px)`, overflow: 'auto'}}>
				<Layout gutter={10}>
					<Section remain>
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={(this.state.currentTaskNum!=0)?`Task ${this.state.currentTaskNum}`: "Tasks"}>
							{tasks}
						</Dropdown>
					</Section>
					<Section><div className="button" onClick={this.loadSavedCode}>Last Saved Code</div></Section>
					<Section><div className="button" onClick={this.resetCode}>Reset Code</div></Section>
					<Section><div className="button" onClick={this.save}>Save</div></Section>
				</Layout>
				<canvas id="c_tcanvas" width={400} height={250} style={{border: '1px solid black'}}></canvas>
				<div style={{position: "relative"}}>
					<canvas id="c_ycanvas" width={400} height={250} style={{border: '1px solid black'}}></canvas>
					<span className="button" onClick={this.runFullScreen} style={{position: "absolute",display: "inline-block", bottom: 0, right: 0}}>FullScreen</span>
				</div>
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		tasks: state.tasks
	}
};
export let Task = connect(mapStateToProps)(Task_);

export class AddTask extends React.Component {
	constructor() {
		super();
		this.addTask = this.addTask.bind(this);
		SocketIO.request("TASK_GET").then(console.log).catch(console.log);
	}
	addTask(data: any) {
		console.log(data);
		SocketIO.request("TASK_ADD", data).then(alert).catch(alert);
	}
	render() {
		return <Form onSubmit={this.addTask}>
			<Text type="area" name="question" >Question</Text>
			<Text type="area" name="resetCode" >Reset Code :)</Text>
			<input type="submit" />
		</Form>
	}
}