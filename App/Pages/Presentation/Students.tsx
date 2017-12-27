import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';
import { Flash } from 'classui/Components/Flash';
import { IRootState, connect } from 'App/State';

interface IProps {
	students: any[]
};
interface IState {
	selected: any[]
};

export class Students_ extends React.Component<IProps, IState> {
	componentDidMount() {
		Me.getUserList();
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			selected: []
		}
	}
	render() {
		return <>
			<div style={{maxWidth: 800, margin: "auto", paddingTop: 30}}>
				<Table onSelect={(selected)=>{this.setState({selected})}} rowSelectable hoverable defaultGroup="batch"
					sortableItems={["name","batch"]}
					headerItems={["_id","name", "batch"]}
					data={this.props.students.filter((student: any)=>student.branch=="CSE")}
					columnUI={{
						"name": (data)=><div style={{padding: 5}}>{data.name}</div>
					}}>
				</Table>
			</div>
		</>;
	}
};

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		students: state.user.list
	}
}
export let Students = connect(mapStateToProps)(Students_);