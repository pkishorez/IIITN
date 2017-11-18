import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from '../State/Utils/PersistentMonaco';
import {runProgramInNewScope} from '../Monaco/Runtime/';
import {compileCode} from '../Monaco/Runtime/typescript';
import {CompileCanvasCode, canvasElemId} from '../Monaco/Runtime/canvas';
import {runProgram} from '../Monaco/Runtime/';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import * as _ from 'lodash';
import {Form, Text} from 'classui/Components/Form';
import {Network} from '../Network';
import {connect} from 'react-redux';
import {IRootState, A_Task, __store} from '../State';
import {Task as TaskAction, Me} from '../MyActions';
import {ITask} from '../State/Reducers/TaskReducer';

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
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			currentTaskNum: 0,
			currentTask: "",
			question: ""
		};
		this.loadTask = this.loadTask.bind(this);
		this.save = this.save.bind(this);
		this.resetCode = this.resetCode.bind(this);
		this.runCode = this.runCode.bind(this);
		this.loadSavedCode = this.loadSavedCode.bind(this);
		this.runFullScreen = this.runFullScreen.bind(this);
	}
	componentDidMount() {
		TaskAction.init();
	}
	loadTask(taskNum: number, id: string) {
		let task = this.props.tasks[id];
		let buffer = __store.getState().user.editorBuffers[id];
		let code = buffer?buffer:task.saved;
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
	}
	save() {
		Me.saveTask({
			id: this.state.currentTask,
			code: this.editorRef.getModifiedEditor().getValue()
		}).then(alert).catch(alert);
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
				<PersistMonaco id={this.state.currentTask} diffContent={{content: "/*\n\tSelect task from task Menu :)\n*/"}} content="/*\n\tSelect task from task Menu :)\n*/" ctrlEnterAction={this.runCode} height={`calc(100vh - 100px)`} editorRef={(ref)=>(this.editorRef as any)=ref}/>
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

interface IAddTaskState {
	currentTask: string | "NEW TASK"
}
class TaskManager_ extends React.Component<IProps, IAddTaskState> {
	resetCodeRef: monaco.editor.IStandaloneCodeEditor;
	questionRef: monaco.editor.IStandaloneCodeEditor;
	dropdown: Dropdown;
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			currentTask: "NEW TASK"
		};
		this.addTask = this.addTask.bind(this);
		this.runCode = this.runCode.bind(this);
		this.loadTask = this.loadTask.bind(this);
		this.modifyTask = this.modifyTask.bind(this);
		this.saveTask = this.saveTask.bind(this);
	}
	componentDidMount() {
		TaskAction.init();
	}

	addTask() {
		let data: any = {};
		data.question = this.questionRef.getValue();
		data.resetCode = this.resetCodeRef.getValue();
		TaskAction.add(data).then((success)=>{
			alert(success);
			this.questionRef.setValue(defaultCode);
			this.resetCodeRef.setValue(defaultCode);
		}).catch(alert);
	}
	modifyTask() {
		let data: any = {};
		data.id = this.state.currentTask;
		data.question = this.questionRef.getValue();
		data.resetCode = this.resetCodeRef.getValue();
		TaskAction.modify(data).then(alert).catch(alert);
	}
	saveTask() {
		if (this.state.currentTask!="NEW TASK") {
			this.modifyTask();
		}
		else {
			this.addTask();
		}
	}
	loadTask(id: string) {
		this.setState({
			currentTask: id
		});
		this.dropdown.dismiss();
		if (id=="") {
			this.questionRef.setValue(defaultCode);
			this.resetCodeRef.setValue(defaultCode);
		}
		let task = this.props.tasks[id];
		this.resetCodeRef.setValue(task.resetCode?task.resetCode:"");
		this.questionRef.setValue(task.question?task.question:"");
	}
	runCode() {
		Flash.flash((dimsiss)=>{
			return <canvas id="canvas" width={400} height={300} ref={()=>{
				runProgramInNewScope(CompileCanvasCode(this.questionRef.getValue(), "canvas"));				
			}}>
			</canvas>;
		}, false, true);
	}
	render() {
		let tasks = [];
		tasks.push(<li key={""} onClick={()=>this.loadTask("")}>New Task</li>)
		for (let i in this.props.tasks) {
			tasks.push(<li key={i} onClick={()=>this.loadTask(i)}>Task - {i}</li>);
		}
		return <div style={{display: 'inline-block', width: "100%"}}>
			<Layout gutter={20} justify="start" style={{margin: 20}}>
				<Section>
					<span className="button" onClick={this.saveTask}>Save</span>
				</Section>
				<Section remain>
					<div style={{zIndex: 1, position: "relative"}}>
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={this.state.currentTask=="NEW TASK"?this.state.currentTask:`Task ${this.state.currentTask}`}>
							{tasks}
						</Dropdown>
					</div>
				</Section>
			</Layout>
			<Layout gutter={20} equalWidth>
				<Section>
					<PersistMonaco id="" height={500} content={defaultCode} ctrlEnterAction={this.runCode} editorRef={(ref)=>(this.questionRef as any)=ref}/>
				</Section>
				<Section>
					<PersistMonaco id="" height={500} content={defaultCode} editorRef={(ref)=>(this.resetCodeRef as any)=ref}/>
				</Section>
			</Layout>
		</div>;
	}
}

let AddTaskmapStateToProps = (state: IRootState): IProps=>{
	return {
		tasks: state.tasks
	}
};
export let TaskManager = connect(AddTaskmapStateToProps)(TaskManager_);
