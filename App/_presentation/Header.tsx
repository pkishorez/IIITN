import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavBar, NavbarRemain} from 'classui/Navbar';
import {RouterButton} from './RouteComponent';
import {Dropdown} from 'classui/Components/Dropdown';
import {connect} from 'react-redux';
import {IRootState} from 'App/State/RootReducer';
import {RequireAuthentication} from 'App/Pages/Presentation/Login';
import {Me} from 'App/MyActions';
import { FlashPlaygroundTypescript } from 'App/Pages/Playground/typescript';

interface IProps {
	userid: string | null
};
interface IState {};

class _Header extends React.Component<IProps, IState> {
	playgroundDD: Dropdown;
	tasksDD: Dropdown;
	constructor(props: any, context: any) {
		super(props, context);
	}
	render() {
		return <NavBar fixed logo="Programmer's Club">
			<NavbarRemain/>
			<RouterButton to="/lbd/starter"><div className="button">Guides</div></RouterButton>
			<Dropdown button="Playground" ref={(ref)=>this.playgroundDD = ref as Dropdown} push="left">
				<li onClick={()=>{FlashPlaygroundTypescript();this.playgroundDD.dismiss()}}>Typescript</li>
				<RouterButton to="/2dplayground"><li onClick={()=>this.playgroundDD.dismiss()}>Canvas2D</li></RouterButton>
				<li className="disable">Typescript CheatSheet</li>
			</Dropdown>
			<Dropdown button="tasks" ref={(ref)=>this.tasksDD = ref as Dropdown} push="left">
				<RouterButton to="/task/basics"><li onClick={()=>this.tasksDD.dismiss()}>My Tasks</li></RouterButton>
				<RouterButton to="/task/manage"><li onClick={()=>this.tasksDD.dismiss()}>Manage Tasks</li></RouterButton>
				<li className="disable">Dashboard</li>
			</Dropdown>
			{/*}
			<RouterButton to="/typescript"><div className="button">Typescript</div></RouterButton>
			<RouterButton to="/students"><div className="button">Students</div></RouterButton>
			{*/}
			<div className="button" onClick={()=>{
				Me.logout();
				RequireAuthentication({
					message: "Please login."
				});
			}}>{this.props.userid?"logout":"Login"}</div>
		</NavBar>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		userid: state.user.userid
	};
}
export let Header = connect(mapStateToProps)(_Header);