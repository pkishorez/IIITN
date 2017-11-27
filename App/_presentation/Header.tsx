import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavBar, NavbarRemain} from 'classui/Navbar';
import {RLink} from 'classui/Helper/RLink';
import {Dropdown} from 'classui/Components/Dropdown';
import {connect} from 'react-redux';
import {IRootState} from 'App/State/RootReducer';
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
			<RLink to="/lbd"><div className="button">Guides</div></RLink>
			<Dropdown button="Playground" ref={(ref)=>this.playgroundDD = ref as Dropdown} push="left">
				<li onClick={()=>{FlashPlaygroundTypescript();this.playgroundDD.dismiss()}}>Typescript</li>
				<RLink to="/2dplayground"><li onClick={()=>this.playgroundDD.dismiss()}>Canvas2D</li></RLink>
				<RLink to="/starter"><li onClick={()=>this.playgroundDD.dismiss()}>Demo</li></RLink>
			</Dropdown>
			<Dropdown button="tasks" ref={(ref)=>this.tasksDD = ref as Dropdown} push="left">
				<RLink to="/task"><li onClick={()=>this.tasksDD.dismiss()}>My Tasks</li></RLink>
				<RLink to="/task/manage"><li onClick={()=>this.tasksDD.dismiss()}>Manage Tasks</li></RLink>
				<li>Dashboard (TODO)</li>
			</Dropdown>
			{/*}
			<RLink to="/typescript"><div className="button">Typescript</div></RLink>
			<RLink to="/students"><div className="button">Students</div></RLink>
			{*/}
			<RLink to="/login"><div className="button" onClick={Me.logout}>{this.props.userid?"logout":"Login"}</div></RLink>
		</NavBar>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		userid: state.user.userid
	};
}
export let Header = connect(mapStateToProps)(_Header);