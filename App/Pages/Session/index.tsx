import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me, Session} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';
import { Table } from 'classui/Components/Table';
import { Flash } from 'classui/Components/Flash';
import { Feedback } from 'classui/Components/Feedback';
import { connect, IRootState, GetState } from 'App/State';
import * as _ from 'lodash';
import * as classNames from 'classnames';

interface IProps {
	students: any[]
	onlineUserList: string[]
	sessionStudentIds: string[]
	sitting: IRootState["session"]["sitting"]
};
interface IState {
	selected: any[]
};

let errorPopped = false;

export class SessionView_ extends React.Component<IProps, IState> {
	componentDidMount() {
		Me.getUserList();
		Session.init();
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
		let rows = ["A", "B", "C", "D", "E"];
		let cols = _.range(1, 11);
		return <div style={{maxWidth: 1000, margin: "auto", paddingTop: 30}}>
			{GetState().user.userid=="admin"?<div className="button primary" onClick={()=>{
				Session.POMPOMMMMALL().then((msg)=>{
					Feedback.show(msg, "success");
				});
			}}>POMPOMM ALL</div>:null}
			{rows.map((i)=>{
				return <Layout key={i} equallySpaced gutter={10} style={{marginBottom: 10}}>
					{cols.map((j)=>{
						return <Section key={j}>
						<div className={classNames("badge", {
							grey: !this.props.sitting[i+j],
							success: (this.props.sitting[i+j]?true: false) && _.includes(this.props.onlineUserList, this.props.sitting[i+j]),
							error: (this.props.sitting[i+j]?true: false) && !_.includes(this.props.onlineUserList, this.props.sitting[i+j])
						})} style={{padding: 20}} onClick={()=>{
							if (errorPopped) {
								Session.POMPOMMMM(i+j).then((msg)=>{
									Feedback.show(msg, "success");
								});
								return;
							}
							Session.sit(i+j).catch((err)=>{
								if (GetState().user.userid=="admin"){
									errorPopped = true;
									Flash.flash((dismiss)=>{
										return <div>
											<div className="button" onClick={dismiss} style={{position: "fixed", top: 50, right: 50}}>Close</div>
											<h1 className="badge error" style={{fontWeight: 900, padding: 10}}>{err}</h1>
										</div>
									}, true, true, true);
								}
							})
						}}>
							{i}{j}
						</div>
						</Section>
					})}
				</Layout>
			})}
		</div>;
	}
};

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		onlineUserList: state.user.onlineUserList,
		students: state.user.list,
		sessionStudentIds: state.session.students,
		sitting: state.session.sitting
	};
}
export let SessionView = connect(mapStateToProps)(SessionView_);