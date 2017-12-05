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
import {AddOrEditCanvasTask} from './canvas';
import { OrderedMapList } from 'classui/Components/OrderedMapList';

interface IProps {
	tasks: IRootState["tasks"]
};
class TaskManager_ extends React.Component<IProps> {
	constructor(props: any, context: any) {
		super(props, context);
	}
	componentDidMount() {
		TaskAction.init();
	}
	render() {
		return <div>
				<div style={{width: 500, margin: "auto", paddingTop: 20}}>
					<div className="button" onClick={()=>{
						// ADD TASK
						Manager.addTask();
					}}>Add Task.</div>

					<OrderedMapList onClick={(task_id)=>{
						// EDIT TASK.
						Manager.editTask(task_id, this.props.tasks.map[task_id]);
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
					onDelete={(task_id)=>{
						confirm("Do you want to delete task?")?
						TaskAction.perform({
							type: "TASK_ACTION",
							orderedMapAction: {
								type: "DELETE",
								_id: task_id
							}
						}):null
					}}
					/>
				</div>
		</div>;
	}
}


let ManageTaskmapStateToProps = (state: IRootState): IProps=>{
	return {
		tasks: state.tasks
	}
};
export let TaskManager = connect(ManageTaskmapStateToProps)(TaskManager_);

let Manager = {
	addTask() {
		Flash.flash(()=>{
			return <div style={{maxWidth: 300}}>
				<div className="button primary" style={{padding: 20, margin: 20}}>Typescript Task</div>
				<div className="button primary" style={{padding: 20, margin: 20}} onClick={()=>{
					AddOrEditCanvasTask({});
				}}>Canvas Task</div>
			</div>;
		}, false, false, true);
	},
	editTask(task_id: string, task: ITask) {
		if (task.type=="CANVAS2D") {
			AddOrEditCanvasTask(task, task_id);
		}
		// For other types goes here...
	}
}