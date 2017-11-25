import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {defaultCode} from './index';

interface IProps {
	tasks: IRootState["tasks"]
};
interface IManageTaskState {
	currentTask: string | ""
}
class TaskManager_ extends React.Component<IProps, IManageTaskState> {
	resetCodeRef: monaco.editor.IStandaloneCodeEditor;
	questionRef: monaco.editor.IStandaloneCodeEditor;
	dropdown: Dropdown;
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			currentTask: ""
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
		if (this.state.currentTask!="") {
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
			return;
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
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={!this.props.tasks.map[this.state.currentTask]?"New Task":`Task - ${this.state.currentTask}`}>
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

let ManageTaskmapStateToProps = (state: IRootState): IProps=>{
	return {
		tasks: state.tasks
	}
};
export let TaskManager = connect(ManageTaskmapStateToProps)(TaskManager_);
