import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me, Session} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';
import { Flash } from 'classui/Components/Flash';
import { Feedback } from 'classui/Components/Feedback';
import { connect, IRootState } from 'App/State';
import * as _ from 'lodash';

interface IProps {
	students: any[]
	sessionStudentIds: string[]
};
interface IState {
	selected: any[]
};

export class SessionManage_ extends React.Component<IProps, IState> {
	componentDidMount() {
		Me.getUserList();
		Session.init().then((data)=>console.log("INIT STUDENTS : ",data));
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			selected: []
		}
	}
	render() {
		let sessionStudents = this.props.students.filter((student)=>{
			if (_.includes(this.props.sessionStudentIds, student._id))
				return true;
			return false;
		});
		return <div style={{maxWidth: 800, margin: "auto", paddingTop: 30}}>
			<div style={{textAlign: "right"}}>
				<span className="badge carrot inline-block" style={{marginRight: 20}}>
					<b>{sessionStudents.length}</b> Students
				</span>
				<span className="button inline-block" onClick={()=>{
					let otherStudentIDS = _.difference(_.map(this.props.students, "_id"), this.props.sessionStudentIds);
					console.log(otherStudentIDS);
					AddStudents(_.filter(this.props.students, (student)=>_.includes(otherStudentIDS, student._id)));
				}} style={{marginRight: 20}}>Add Students</span>
				<span className="button primary inline-block" onClick={()=>{
					console.log(this.state.selected);
					Session.delStudents(this.state.selected).then((msg)=>{
						Feedback.show(msg, "success");
					})
				}}>Delete <i className="fa fa-trash"></i></span>
			</div>
			<Table onSelect={(selected)=>{
				this.setState({
					selected: selected.map((item)=>item._id)
				})
			}} rowSelectable hoverable defaultGroup="batch"
				sortableItems={["name","batch"]}
				headerItems={["_id","name", "batch"]}
				data={sessionStudents}
				columnUI={{
					"name": (data)=><div style={{padding: 5}}>{data.name}</div>
				}}>
			</Table>
		</div>;
	}
};

let AddStudents = (students: any[])=>{
	let selectedIDS: string[];
	Flash.flash((dismiss)=><Layout direction="column" gutter={10} style={{height: "calc(100vh - 100px)", overflow: "auto", width: 800}}>
		<Section>
			<div className="button primary" onClick={()=>{
				Session.addStudents(selectedIDS).then((msg)=>{
					dismiss();
					Feedback.show(msg, "success");
				});
			}}>Add Students</div>
		</Section>
		<Section remain>
			<Table onSelect={(selected)=>{
					selectedIDS = selected.map((item)=>item._id);
				}} rowSelectable hoverable defaultGroup="batch"
				sortableItems={["name","batch"]}
				headerItems={["_id","name", "batch"]}
				data={students}
				columnUI={{
					"name": (data)=><div style={{padding: 5}}>{data.name}</div>
				}}>
			</Table>
		</Section>
	</Layout>, false, false, true);
};

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		students: state.user.list,
		sessionStudentIds: state.session.students
	};
}
export let SessionManage = connect(mapStateToProps)(SessionManage_);