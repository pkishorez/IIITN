import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {connect, IRootState} from 'App/State';
import { Task } from 'App/MyActions';
import * as _ from 'lodash';
import { IOrderedMap } from 'classui/DataStructures/OrderedMap';
import { ITypescriptTestCaseTask } from 'Server/Database/Schema/Task';
import { Flash } from 'classui/Components/Flash';
import { TestCaseChallenge } from 'App/Monaco/Tasks/Typescript/TestCaseChallenge';
import {Table} from 'classui/Components/Table';

interface IProps {
	tasks: IOrderedMap<ITypescriptTestCaseTask>
	userTasks: IRootState["user"]["taskDetails"]
}
interface IState {
	task_id: string
};

class TasksTypescriptView_ extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.attemptTask = this.attemptTask.bind(this);
	}
	componentDidMount() {
		Task.init();
	}
	attemptTask(task_id: string) {
		Flash.flash((dismiss)=>{
			return <div>
				<div className="button" style={{
					position: 'fixed',
					top:50,
					right: 50
				}} onClick={dismiss}>Close</div>
				<Tasks task_id={task_id} tasks={this.props.tasks} userTasks={this.props.userTasks}/>
			</div>;
		}, true, true, true);
	}
	render() {
		let data = Object.keys(this.props.tasks.map).map((task_id)=>{
			return {
				...this.props.tasks.map[task_id],
				task_id,
				status: this.props.userTasks[task_id]?"cleared":"todo"
			}
		});
		return <Layout style={{maxWidth: 935, margin: 'auto'}} gutter={15} justify="center" align="start">
			<Section style={{marginTop: 20}} remain>
				<Table hoverable rowOnClick={(data)=>{
					this.attemptTask(data.task_id);
				}} headerItems={["title", "status"]} sortableItems={["status"]} data={data} columnUI={{
					"status": (data)=>{
						return <div className={("badge inline-block "+(data.status=="cleared"?"success": "grey"))}>{
							data.status
						}</div>
					}
				}}>
				</Table>
			</Section>
		</Layout>;
	}
}

class Tasks extends React.Component<IProps & {task_id: string}, {task_id: string}> {
	constructor(props: IProps & {task_id: string}, context: any) {
		super(props, context);
	}
	render() {
		let task = this.props.tasks.map[this.props.task_id];
		return <Layout style={{maxWidth: "100%", width: 1024}} gutter={20}>
			<Section remain>
				<TestCaseChallenge height="calc(100vh - 100px)" task={task} task_id={this.props.task_id} />
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	let typescript_tasks_keys = Object.keys(state.tasks.map).filter((task_id)=>{
		return state.tasks.map[task_id].type=="TYPESCRIPT_TESTCASE_TASK";
	});
	let map = {};
	for (let key of typescript_tasks_keys) {
		map = {
			...map,
			[key]: state.tasks.map[key]
		}
	}
	let order = _.difference(state.tasks.order, _.difference(state.tasks.order, typescript_tasks_keys));
	let typescriptTasks = {
		map,
		order
	}
	return {
		tasks: typescriptTasks,
		userTasks: state.user.taskDetails
	}
}
export let TasksTypescriptView = connect(mapStateToProps)(TasksTypescriptView_);
