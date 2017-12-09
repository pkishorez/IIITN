import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {DraftEditorRender, convertToRaw} from 'App/DraftEditor';
import {connect, IRootState} from 'App/State';
import {IGuide, IModule} from 'App/State/Reducers/GuideReducer';
import { Guide } from 'App/MyActions';
import { ITask } from 'Server/Database/Schema';
import * as _ from 'lodash';
import { IOrderedMap } from 'classui/DataStructures/OrderedMap';
import { ITypescriptTask, ITypescriptTestCaseTask } from 'Server/Database/Schema/Task';
import { ConsoleTask } from 'App/Monaco/Tasks/Typescript/ConsoleTask';
import { Flash } from 'classui/Components/Flash';
import { ExpectedOutputChallenge } from 'App/Monaco/Tasks/Typescript/ExpectedOutputChallenge';
import { TestCaseChallenge } from 'App/Monaco/Tasks/Typescript/TestCaseChallenge';

interface IProps {
	tasks: IOrderedMap<ITypescriptTestCaseTask>
}
interface IState {
	task_id: string
};

class TasksTypescriptView_ extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
	}
	componentDidMount() {
		Flash.flash((dismiss)=>{
			return <div>
				<div className="button" style={{
					position: 'fixed',
					top:50,
					right: 50
				}} onClick={dismiss}>Close</div>
				<Tasks tasks={this.props.tasks}/>
			</div>;
		}, true, true, true);
		Guide.init();
	}
	render() {
		return <Layout style={{maxWidth: 935, margin: 'auto'}} gutter={15} justify="center" align="start">
			<Section remain>
				<Menu header="Tasks">
					{
						this.props.tasks.order.map((task_id)=>{
							return <Item onClick={()=>{
							}} key={task_id}>{this.props.tasks.map[task_id].title}</Item>
						})
					}
				</Menu>
			</Section>
		</Layout>;
	}
}

class Tasks extends React.Component<IProps, {task_id: string}> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			task_id: props.tasks.order[0]
		};
	}
	render() {
		let task = this.props.tasks.map[this.state.task_id];
		return <Layout style={{maxWidth: "100%", width: 1024}} gutter={20}>
			<Section remain>
				<TestCaseChallenge height="calc(100vh - 100px)" task={task} task_id={this.state.task_id} />
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
		tasks: typescriptTasks
	}
}
export let TasksTypescriptView = connect(mapStateToProps)(TasksTypescriptView_);
