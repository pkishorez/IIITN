import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, GetState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {defaultCode} from './index';

interface IProps {
	tasks: IRootState["tasks"]
};
interface IState {
	currentTaskNum: number
	currentTask: string
	userCode: string
};

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
		// Load from buffer.
		let buffer = GetState().user.editorBuffers[id];
		// Load from User Saved task.
		let code = buffer?buffer:GetState().user.tasks[id];
		// Load from reset Code.
		code = code?code:task.resetCode;
		// Load from default code.
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
		Me.saveTask({
			id: this.state.currentTask,
			code: this.editorRef.getModifiedEditor().getValue()
		}).then(alert).catch(alert);
	}
	loadSavedCode() {
		// Load From Saved Task.
		let savedTask = GetState().user.tasks[this.state.currentTask];
		let scode = savedTask?savedTask:"NO SAVED TASK FOUND :(";
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