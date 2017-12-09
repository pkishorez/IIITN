import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, GetState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import * as _ from 'lodash';
import { ICanvasTask } from 'Server/Database/Schema/Task';

interface IProps {
	userTaskDetails: IRootState["user"]["taskDetails"]
	tasks: IRootState["tasks"]
};
interface IState {
	currentTaskID: string
	userCode: string
	userRunCode: string
};

class Task_ extends React.Component<IProps, IState>{
	editorRef: monaco.editor.IStandaloneDiffEditor;
	dropdown: Dropdown;
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			currentTaskID: "",
			userCode: "",
			userRunCode: ""
		};
		this.loadTask = this.loadTask.bind(this);
		this.save = this.save.bind(this);
		this.runUserCode = this.runUserCode.bind(this);
		this.runFullScreen = this.runFullScreen.bind(this);
		this.setCodeState = _.debounce(this.setCodeState.bind(this), 100);
	}
	componentDidMount() {
		TaskAction.init();
	}
	setCodeState(code: string, setValue=true) {
		if (!code)
			return;
		this.setState({
			userCode: code
		});
		if (setValue)
			this.editorRef.getModifiedEditor().setValue(code);
	}
	loadTask(task_id: string) {
		let task = this.props.tasks.map[task_id] as ICanvasTask;
		// Load from buffer.
		let buffer = GetState().user.editorBuffers[task_id];
		// Load from User Saved task or resetCode.
		let userTask = this.props.userTaskDetails[task_id];
		let code = buffer?buffer:(userTask?userTask.code:task.resetCode);

		this.editorRef.getOriginalEditor().setValue(task.resetCode);
		this.setCodeState(code);
		this.setState({
			currentTaskID: task_id
		});
		this.runUserCode();
		this.dropdown.dismiss();
	}
	save() {
		Me.saveTask({
			type: "USER_SAVE_TASK",
			taskDetails: {
				_id: this.state.currentTaskID,
				code: this.editorRef.getModifiedEditor().getValue(),
				type: this.props.tasks.map[this.state.currentTaskID].type as "CANVAS2D",
				result: "PENDING"
			}
		});
	}
	runUserCode() {
		this.setState({
			userRunCode: this.editorRef.getModifiedEditor().getValue()
		});
	}
	runFullScreen() {
		Flash.flash((dismiss)=>{
			return <CanvasView width={600} height={500} code={this.editorRef.getModifiedEditor().getValue()}/>;
		}, false, true);
	}
	render() {
		let userTaskDetails = this.props.userTaskDetails[this.state.currentTaskID];
		let currentTask = this.props.tasks.map[this.state.currentTaskID];
		let taskData = {
			savedCode: userTaskDetails?userTaskDetails.code:null,
			resetCode: currentTask?currentTask.resetCode:null,
			questionCode: currentTask?currentTask.question:""
		};
		return <Layout align="center" gutter={20} style={{height: `calc(100vh - 50px)`}}>
			<Section remain>
				<PersistMonaco getOutput={(code)=>this.setCodeState(code, false)} id={this.state.currentTaskID} diffContent={{content: "/*\n\tSelect task from task Menu :)\n*/"}} content="/*\n\tSelect task from task Menu :)\n*/" ctrlEnterAction={this.runUserCode} dimensions={{
					height: `calc(100vh - 100px)`
				}} editorRef={(ref)=>(this.editorRef as any)=ref}/>
			</Section>
			<Section basis={402} style={{maxHeight: `calc(100vh - 50px)`, overflow: 'auto'}}>
				<Layout gutter={10}>
					<Section remain>
						<Dropdown buttonMaxWidth={100} ref={(ref)=>{this.dropdown=ref as Dropdown}} button={(this.state.currentTaskID!="")?currentTask.title: "Tasks"}>
							{
								this.props.tasks.order.map((task_id, i)=>{
									return <li key={task_id} onClick={()=>{
										this.loadTask(task_id);
									}}>{i+1}. {this.props.tasks.map[task_id].title}</li>
								})
							}
						</Dropdown>
					</Section>
					<Section>
						<div className={"button "+(((this.state.currentTaskID!="") && (taskData.savedCode!=this.state.userCode) && taskData.savedCode)?"":"disable")}
							onClick={()=>{
								if (taskData.savedCode)
									this.setCodeState(taskData.savedCode);
						}}>Saved</div></Section>
					<Section>
						<div className={
							"button "+((taskData.resetCode && (taskData.resetCode!=this.state.userCode))?"":"disable")
						} onClick={()=>{
							if (taskData.resetCode)
								this.setCodeState(taskData.resetCode);
						}}>Reset</div></Section>
					<Section>
						<div className={"button primary "+
							(((this.state.currentTaskID!="") && (taskData.savedCode!=this.state.userCode))?
							"":"disable")
						} onClick={this.save}>Save</div>
					</Section>
				</Layout>
				<CanvasView code={taskData.questionCode} width={400} height={250} style={{border: '1px solid black'}} />
				<div style={{position: "relative"}}>
					<span className="button" onClick={this.runFullScreen} style={{position: "absolute",display: "inline-block", bottom: 0, right: 0}}>FullScreen</span>
					<CanvasView code={this.state.userRunCode} width={400} height={250} style={{border: '1px solid black'}} />
				</div>
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		userTaskDetails: state.user.taskDetails,
		tasks: state.tasks
	}
};
export let TasksCanvasView = connect(mapStateToProps)(Task_);