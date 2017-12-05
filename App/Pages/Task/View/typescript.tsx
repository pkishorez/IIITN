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
import { ITypescriptTask } from 'Server/Database/Schema/Task';
import { ConsoleTask } from 'App/Monaco/Tasks/Typescript/ConsoleTask';

interface IProps {
	tasks: IOrderedMap<ITypescriptTask>
}
interface IState {
	task_id: string
};

class TasksTypescriptView_ extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			task_id: ""
		};
	}
	componentDidMount() {
		Guide.init();
	}
	render() {
		if (this.state.task_id=="" && this.props.tasks.order[0]) {
			this.setState({
				task_id: this.props.tasks.order[0]
			})	
		}
		let task = this.props.tasks.map[this.state.task_id];
		task = task?task:{
			expectedOutput: "",
			question: "",
			resetCode: "",
			title: "",
			type: "TYPESCRIPT_EXPOUTPUT"
		};
		return <Layout style={{maxWidth: 935, margin: 'auto'}} gutter={15} justify="center" align="start">
			<Section remain>
				<Menu header="Tasks">
					{
						this.props.tasks.order.map((task_id)=>{
							return <Item active={task_id==this.state.task_id} onClick={()=>{
								this.setState({
									task_id
								})
							}} key={task_id}>{this.props.tasks.map[task_id].title}</Item>
						})
					}
				</Menu>
			</Section>
			<Section width={700} clsName="card-1" style={{padding: "10px 25px", backgroundColor: 'white'}}>
				<DraftEditorRender contentState={task.question}/>
				{this.state.task_id!=""?<ConsoleTask eid="" expectedOutput={task.expectedOutput}/>:null}
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	let typescript_tasks_keys = Object.keys(state.tasks.map).filter((task_id)=>{
		return state.tasks.map[task_id].type=="TYPESCRIPT_EXPOUTPUT";
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
