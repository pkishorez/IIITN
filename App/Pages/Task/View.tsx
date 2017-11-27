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
import * as _ from 'lodash';

interface IProps {
	savedTasks: IRootState["user"]["tasks"]
	tasks: IRootState["tasks"]
};
interface IState {
	currentTaskID: string
	userCode: string
};

class Task_ extends React.Component<IProps, IState>{
	editorRef: monaco.editor.IStandaloneDiffEditor;
	dropdown: Dropdown;
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			currentTaskID: "",
			userCode: ""
		};
		this.loadTask = this.loadTask.bind(this);
		this.save = this.save.bind(this);
		this.runCode = this.runCode.bind(this);
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
		let task = this.props.tasks.map[task_id];
		// Load from buffer.
		let buffer = GetState().user.editorBuffers[task_id];
		// Load from User Saved task.
		let code = buffer?buffer:this.props.savedTasks[task_id];
		// Load from reset Code.
		code = code?code:task.resetCode;

		this.editorRef.getOriginalEditor().setValue(task.resetCode?task.resetCode:"\n");
		this.setCodeState(code);
		this.setState({
			currentTaskID: task_id
		});
		this.runCode();
		this.dropdown.dismiss();
	}
	save() {
		Me.saveTask({
			id: this.state.currentTaskID,
			code: this.editorRef.getModifiedEditor().getValue()
		});
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
		let currentTask = {
			savedCode: this.props.savedTasks[this.state.currentTaskID],
			resetCode: this.props.tasks.map[this.state.currentTaskID]?this.props.tasks.map[this.state.currentTaskID].resetCode:null
		}
		let question_code = this.props.tasks.map[this.state.currentTaskID]?this.props.tasks.map[this.state.currentTaskID].question:"";
		return <Layout align="center" gutter={20} style={{height: `calc(100vh - 50px)`}}>
			<Section remain>
				<PersistMonaco getOutput={(code)=>this.setCodeState(code, false)} id={this.state.currentTaskID} diffContent={{content: "/*\n\tSelect task from task Menu :)\n*/"}} content="/*\n\tSelect task from task Menu :)\n*/" ctrlEnterAction={this.runCode} height={`calc(100vh - 100px)`} editorRef={(ref)=>(this.editorRef as any)=ref}/>
			</Section>
			<Section minWidth={402} style={{maxHeight: `calc(100vh - 50px)`, overflow: 'auto'}}>
				<Layout gutter={10}>
					<Section remain>
						<Dropdown ref={(ref)=>{this.dropdown=ref as Dropdown}} button={(this.state.currentTaskID!="")?`${this.props.tasks.map[this.state.currentTaskID].title}`: "Tasks"}>
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
						<div className={
							"button "+(
								(currentTask.savedCode && (currentTask.savedCode!=this.state.userCode))?
								"":"disable")}
							onClick={()=>{
								this.setCodeState(currentTask.savedCode);
						}}>Saved Code</div></Section>
					<Section>
						<div className={
							"button "+((currentTask.resetCode &&(currentTask.resetCode!=this.state.userCode))?"":"disable")
						} onClick={()=>{
							if (currentTask.resetCode)
								this.setCodeState(currentTask.resetCode);
						}}>Reset Code</div></Section>
					<Section>
						<div className={"button primary "+
							((currentTask.savedCode && (currentTask.savedCode!=this.state.userCode))?"":"disable")
						} onClick={this.save}>Save</div>
					</Section>
				</Layout>
				<CanvasView code={question_code} width={400} height={250} style={{border: '1px solid black'}} />
				<div style={{position: "relative"}}>
					<span className="button" onClick={this.runFullScreen} style={{position: "absolute",display: "inline-block", bottom: 0, right: 0}}>FullScreen</span>
					<CanvasView code={this.state.userCode} width={400} height={250} style={{border: '1px solid black'}} />
				</div>
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		savedTasks: state.user.tasks,
		tasks: state.tasks
	}
};
export let Task = connect(mapStateToProps)(Task_);