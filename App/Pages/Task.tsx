import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CanvasMonaco} from '../Monaco/CanvasMonaco';
import {compileCode} from '../Monaco/Runtime/typescript';
import {runProgram} from '../Monaco/Runtime/';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
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

let canvasElem = document.getElementById("canvas") as HTMLCanvasElement;
canvasElem.width = 500;
canvasElem.height = 400;
canvasElem.style.backgroundColor = "white";

let canvas = new Canvas(canvasElem, true);
`;

class Task_ extends React.Component<IProps, IState>{
	editorRef: monaco.editor.IStandaloneCodeEditor;
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
		this.saveBuffer = _.debounce(this.saveBuffer.bind(this), 200);
	}
	componentDidMount() {
		TaskAction.get().then((ts)=>{
			let tasks: IRootState["tasks"] = {};
			// Compute tasks from ts.
			ts.mainTasks.map((t: any)=>{
				tasks[t._id] = {
					question: t.question,
					resetCode: t.resetCode,
					saved: ts.userTasks[0].tasks[t._id],
					buffer: t.resetCode
				}
			});
			console.log(tasks);
			store.dispatch(A_Task.init(tasks));
		});
	}
	loadTask(taskNum: number, id: string) {
		let task = this.props.tasks[id];
		let code = task.buffer?task.buffer:task.resetCode;
		this.editorRef.setValue(code?code:defaultCode);
		this.setState({
			currentTaskNum: taskNum,
			currentTask: id
		});
		this.dropdown.dismiss();

		// Load the question in tcanvas. TODO
	}
	save() {
		TaskAction.save(this.state.currentTask, this.editorRef.getValue()).then(alert).catch(alert);
	}
	saveBuffer(value: string) {
		store.dispatch(A_Task.saveBuffer(this.state.currentTask, value?value:""));
	}
	render() {
		let tasks = [], index = 0;
		for (let i in this.props.tasks) {
			index++;
			let ind = index;
			tasks.push(<li key={i} onClick={()=>this.loadTask(ind, i)}>Task - {index}</li>);
		}
		return <Layout align="center" style={{height: `calc(100vh - 50px)`}} gutter={20}>
			<Section remain>
				<CanvasMonaco height={`calc(100vh - 100px)`} getOutput={this.saveBuffer} editorRef={(ref)=>this.editorRef=ref}/>
			</Section>
			<Section width={402} style={{overflow: 'auto'}}>
				<Layout gutter={20}>
					<Section remain>
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={(this.state.currentTaskNum!=0)?`Task - ${this.state.currentTaskNum}`: "Tasks"}>
							{tasks}
						</Dropdown>
					</Section>
					<Section><div className="button" onClick={this.save}>Save</div></Section>
				</Layout>
				<canvas id="tcanvas" width={400} height={250} style={{border: '1px solid black'}}></canvas>
				<canvas id="ycanvas" width={400} height={250} style={{border: '1px solid black'}}></canvas>
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
		SocketIO.request("TASK_ADD", {
			question: data.question
		}).then(alert).catch(alert);
	}
	render() {
		return <Form onSubmit={this.addTask}>
			<Text type="area" name="question" >Question</Text>
			<Text type="area" name="resetCode" >Reset Code :)</Text>
			<input type="submit" />
		</Form>
	}
}