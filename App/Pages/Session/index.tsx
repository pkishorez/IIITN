import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me, Session, Task} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';
import { Flash } from 'classui/Components/Flash';
import { Feedback } from 'classui/Components/Feedback';
import { connect, IRootState, GetState } from 'App/State';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { Menu } from 'classui/Components/Menu';

interface IProps {
	students: any[]
	onlineUserList: string[]
	sessionStudentIds: string[]
	sitting: IRootState["session"]["sitting"]
	tasks: IRootState["tasks"]
};
interface IState {
	selected: any[]
};

let errorPopped = false;

export class SessionView_ extends React.Component<IProps, IState> {
	componentDidMount() {
		Me.getUserList();
		Session.init();
		Task.init();
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			selected: []
		}
		this.toggleUser = this.toggleUser.bind(this);
	}
	toggleUser(pos: string) {
		let selected: string[];
		if (!_.includes(this.state.selected, pos))
			selected = [...this.state.selected, pos];
		else 
			selected = this.state.selected.filter((p)=>p!=pos);
		this.setState({
			selected
		});
	}
	render() {
		let sessionStudents = this.props.students.filter((student)=>{
			if (_.includes(this.props.sessionStudentIds, student._id))
				return true;
			return false;
		});
		let attendedStudents = _.map(this.props.sitting);

		let rows = ["A", "B", "C", "D", "E"];
		let cols = _.range(1, 11);
		let SittingStats = rows.map((i)=>
		<Layout key={i} equallySpaced gutter={10} style={{marginBottom: 10}}>
			{cols.map((j)=>{
				let pos = i+j;
				let userPresent = !!this.props.sitting[pos];
				let isOnline = _.includes(this.props.onlineUserList, this.props.sitting[pos]);
				return <Section key={j}>
				<div className={classNames("badge", {
					grey: !userPresent,
					success: userPresent && isOnline,
					error: userPresent && !isOnline
				})} style={{padding: 20, position: "relative"}} onClick={()=>{
					if (GetState().user.userid=="admin"){
						this.toggleUser(pos);
						return;
					}
					Session.sit(pos).catch((err)=>Feedback.show(err, "error", 4));
				}}>
					{pos}
					{_.includes(this.state.selected, pos)?<div className="badge sunflower" style={{
						position: "absolute",
						top: 0,
						right: 0,
						padding: "5px 10px"
					}}><i className="fa fa-check"></i></div>:null}
				</div>
				</Section>
			})}
		</Layout>);

		return GetState().user.userid=="admin"?
		<Layout gutter={20} style={{width: "100%", margin: "auto", paddingTop: 30}}>
			<Section>
				<Menu header="Actions">
					<div className="button" onClick={()=>{
						Session.POMPOMMMM(this.state.selected);
					}}>POMPOMM</div>
					<div className="button" onClick={()=>{
						Session.POMPOMMMMALL();
					}}>POMPOMM All</div>
					<div className="button primary" onClick={()=>{
						Flash.flash(()=>{
							let taskTitles = this.props.tasks.order.map((id: string)=>{
								return <div className="button" onClick={()=>{
									Session.getTaskDetails(id, attendedStudents).then((ids: string[])=>{
										Flash.flash(()=>{
											return <h2 style={{backgroundColor: "white", padding: 10}}>
												{ids.length} / {attendedStudents.length}
											</h2>
										}, false, false, true);
									});
								}}>
									{this.props.tasks.map[id]?this.props.tasks.map[id].title: "UNDEFINED"}
								</div>
							});
							return <>
								{taskTitles}
							</>;
						}, false, false, true);
					}}>
						Task Details
					</div>
				</Menu>
			</Section>
			<Section remain>
				{SittingStats}
			</Section>
		</Layout>:<>
			{SittingStats}
		</>;
	}
};

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		onlineUserList: state.user.onlineUserList,
		students: state.user.list,
		sessionStudentIds: state.session.students,
		sitting: state.session.sitting,
		tasks: state.tasks
	};
}
export let SessionView = connect(mapStateToProps)(SessionView_);