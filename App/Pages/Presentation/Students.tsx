import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';
import { Flash } from 'classui/Components/Flash';

interface IProps {};
interface IState {
	students: any
	selected: any[]
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
			students: [],
			selected: []
		}
	}
	render() {
		return <>
			<div style={{maxWidth: 800, margin: "auto", paddingTop: 30}}>
				<Table onSelect={(selected)=>{this.setState({selected})}} rowSelectable hoverable defaultGroup="batch"
					sortableItems={["name","batch"]}
					headerItems={["_id","name", "batch"]}
					data={this.state.students.filter((student: any)=>student.branch=="CSE")}
					columnUI={{
						"name": (data)=><div style={{padding: 5}}>{data.name}</div>
					}}>
				</Table>
			</div>
		</>;
	}
};