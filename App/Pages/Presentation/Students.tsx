import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';

interface IProps {};
interface IState {
	students: any
};

export class Students extends React.Component<IProps, IState> {
	componentDidMount() {
		Me.getStudents().then((data)=>{
			this.setState({
				students:data
			});
		}).catch(console.error);
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			students: []
		}
	}
	render() {
		return <div  style={{maxWidth: 800, margin: "auto"}}>
			<Table hoverable groupableItems={["batch"]} sortableItems={["name","batch", "branch"]} headerItems={["_id","name", "batch", "branch"]} data={this.state.students}>
			</Table>
		</div>;
	}
};