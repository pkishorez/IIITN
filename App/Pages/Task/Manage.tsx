import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {ITask} from 'Server/Database/Schema/Task';
import {defaultCode} from './index';
import { OrderedMapList } from 'classui/Components/OrderedMapList';

interface IProps {
	tasks: IRootState["tasks"]
};
class TaskManager_ extends React.Component<IProps> {
	constructor(props: any, context: any) {
		super(props, context);
		this.deleteTask = this.deleteTask.bind(this);
	}
	componentDidMount() {
		TaskAction.init();
	}

	deleteTask(_id: string) {
		TaskAction.perform({
			type: "TASK_ACTION",
			orderedMapAction: {
				type: "DELETE",
				_id
			}
		}).then(alert).catch(alert);
	}
	render() {
		return <div>
				<div style={{width: 500, margin: "auto"}}>
					<div className="button" style={{marginTop: 10}} onClick={()=>{
						AddOrEditTask({
							title: "",
							type: "CANVAS2D",
							question: defaultCode,
							resetCode: defaultCode
						});
					}}>Add Task.</div>

					<OrderedMapList onClick={(id)=>{
						AddOrEditTask({
							...this.props.tasks.map[id],
							_id: id
						});
					}} orderedMap={this.props.tasks}
					onOrderChange={(order)=>{
						TaskAction.perform({
							type: "TASK_ACTION",
							orderedMapAction: {
								type: "REORDER",
								order
							}
						})
					}}
					onDelete={(id)=>{
						TaskAction.perform({
							type: "TASK_ACTION",
							orderedMapAction: {
								type: "DELETE",
								_id: id
							}
						})
					}}
					/>
				</div>
		</div>;
	}
}

interface IAddEditProps extends ITask{}
let AddOrEditTask = (props: IAddEditProps)=>{
	let resetCodeRef: monaco.editor.IStandaloneCodeEditor|null;
	let questionRef: monaco.editor.IStandaloneCodeEditor|null;
	let input: HTMLInputElement|null;

	Flash.flash((dismiss)=>{
		return <div style={{backgroundColor: "white"}}>
			<Layout justify="center" style={{margin: "auto", padding: "20px 0px", width: 500}}>
				<Section>
					<input defaultValue={props.title} ref={(ref)=>input=ref} type="text" style={{border: "1px solid black", width: 400, padding: 10}} placeholder="Title"/>
				</Section>
				<Section>
					<div className="button" onClick={()=>{
						let task: ITask = {
							title: input?input.value:"",
							type: "CANVAS2D",
							question: questionRef?questionRef.getValue():"",
							resetCode: resetCodeRef?resetCodeRef.getValue():""
						};
						if (props._id) {
							TaskAction.perform({
								type: "TASK_ACTION",
								orderedMapAction: {
									type: "MODIFY",
									_id: props._id,
									value: task
								}
							});
						}
						else {
							TaskAction.perform({
								type: "TASK_ACTION",
								orderedMapAction: {
									type: "ADD",
									value: task
								}
							});
						}
						dismiss();
					}}>Save</div>
				</Section>
			</Layout>
			<Layout gutter={20} equalWidth style={{width: 1024, maxWidth: "100%"}}>
				<Section>
					<PersistMonaco id="" height={500} editorRef={(ref: any)=>questionRef=ref} content={props.question}/>
				</Section>
				<Section>
					<PersistMonaco id="" height={500} editorRef={(ref: any)=>resetCodeRef=ref} content={props.resetCode}/>
				</Section>
			</Layout>
		</div>;
	}, false, true);
}

let ManageTaskmapStateToProps = (state: IRootState): IProps=>{
	return {
		tasks: state.tasks
	}
};
export let TaskManager = connect(ManageTaskmapStateToProps)(TaskManager_);
