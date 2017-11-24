import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {runProgramInNewScope} from 'App/Monaco/Runtime/';
import {compileCode} from 'App/Monaco/Runtime/typescript';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {runProgram} from 'App/Monaco/Runtime/';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import * as _ from 'lodash';
import {Form, Text} from 'classui/Components/Form';
import {Network} from 'App/Network';
import {connect} from 'react-redux';
import {IRootState, GetState} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {ITask} from 'App/State/Reducers/TaskReducer';

interface IProps {
	tasks: IRootState["tasks"]
};
interface IState {
	currentTaskNum: number
	currentTask: string
	userCode: string
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
			userCode: ""
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
		let task = this.props.tasks.map[id];
		let buffer = GetState().user.editorBuffers[id];
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
	}
	save() {
		/*Me.saveTask({
			_id: this.state.currentTask,
			code: this.editorRef.getModifiedEditor().getValue()
		}).then(alert).catch(alert);*/
		alert("Functionality not implemented yet.");
	}
	loadSavedCode() {
		let code = this.props.tasks.map[this.state.currentTask];
		let scode = code.saved?code.saved:"\n";
		this.editorRef.getModifiedEditor().setValue(scode);
	}
	resetCode() {
		let code = this.props.tasks.map[this.state.currentTask];
		let scode = code.resetCode;
		scode = scode?scode: defaultCode;
		this.editorRef.getModifiedEditor().setValue(scode);
	}
	runCode() {
		this.setState({
			userCode: this.editorRef.getModifiedEditor().getValue()
		});
	}
	runFullScreen() {
		Flash.flash((dismiss)=>{
			return <CanvasView width={600} height={500} code={this.editorRef.getModifiedEditor().getValue()}/>;
		}, false, true);
	}
	render() {
		let tasks = [], index = 0;
		for (let i in this.props.tasks.map) {
			index++;
			let ind = index;
			tasks.push(<li key={i} onClick={()=>this.loadTask(ind, i)}>Task - {index}</li>);
		}
		let question_code = this.props.tasks.map[this.state.currentTask]?this.props.tasks.map[this.state.currentTask].question:"";
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
				<CanvasView code={question_code} width={400} height={250} style={{border: '1px solid black'}} />
				<div style={{position: "relative"}}>
					<CanvasView code={this.state.userCode} width={400} height={250} style={{border: '1px solid black'}} />
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
		this.deleteTask = this.deleteTask.bind(this);
	}
	componentDidMount() {
		TaskAction.init();
	}

	addTask() {
		let data = {
			question: this.questionRef.getValue(),
			resetCode: this.resetCodeRef.getValue()
		};
		TaskAction.perform({
			type: "TASK_ACTION",
			orderedMapAction: {
				type: "ADD",
				value: {
					...data,
					saved: data.resetCode
				}
			}
		}).then((success)=>{
			alert("Successfully added.");
			this.questionRef.setValue(defaultCode);
			this.resetCodeRef.setValue(defaultCode);
		}).catch(alert);
	}
	deleteTask() {
		TaskAction.perform({
			type: "TASK_ACTION",
			orderedMapAction: {
				type: "DELETE",
				_id: this.state.currentTask
			}
		}).then(alert).catch(alert);
	}
	modifyTask() {
		TaskAction.perform({
			type: "TASK_ACTION",
			orderedMapAction: {
				type: "MODIFY",
				_id: this.state.currentTask,
				value: {
					question: this.questionRef.getValue(),
					resetCode: this.resetCodeRef.getValue()
				}
			}
		}).then(alert).catch(alert);
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
		let task = this.props.tasks.map[id];
		this.resetCodeRef.setValue(task.resetCode?task.resetCode:"");
		this.questionRef.setValue(task.question?task.question:"");
	}
	runCode() {
		Flash.flash((dimsiss)=>{
			return <CanvasView width={400} height={300} code={this.questionRef.getValue()} />
		}, false, true);
	}
	render() {
		let tasks = [];
		tasks.push(<li key={""} onClick={()=>this.loadTask("")}>New Task</li>)
		for (let i in this.props.tasks.map) {
			tasks.push(<li key={i} onClick={()=>this.loadTask(i)}>Task - {i}</li>);
		}
		return <div style={{display: 'inline-block', width: "100%"}}>
			<Layout gutter={20} justify="start" style={{margin: 20}}>
				<Section>
					<span className="button" onClick={this.saveTask}>Save</span>
				</Section>
				<Section>
					<div style={{zIndex: 1, position: "relative"}}>
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={this.state.currentTask=="NEW TASK"?this.state.currentTask:`Task ${this.state.currentTask}`}>
							{tasks}
						</Dropdown>
					</div>
				</Section>
				<Section>
					<span className="button" onClick={this.deleteTask}>Delete</span>
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
