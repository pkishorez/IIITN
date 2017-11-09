import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavBar, NavbarRemain} from 'classui/Navbar';
import {RLink} from 'classui/Helper/RLink';
import {Dropdown} from 'classui/Components/Dropdown';
import {connect} from 'react-redux';
import {IRootState} from './State/RootReducer';
import {store, A_User} from './State';

interface IProps {
	userid: string | null
};
interface IState {};

class _Header extends React.Component<IProps, IState> {
	dropdown1: Dropdown;
	dropdown2: Dropdown;
	constructor() {
		super();
		this.logout = this.logout.bind(this);
	}
	logout() {
		store.dispatch(A_User.logout());
	}
	render() {
		return <NavBar fixed logo="Programmer's Club">
			<NavbarRemain/>
			<Dropdown button="Playground" ref={(ref)=>this.dropdown1 = ref as Dropdown} push="left">
				<RLink to="/playground"><li onClick={()=>this.dropdown1.dismiss()}>Typescript</li></RLink>
				<RLink to="/2dplayground"><li onClick={()=>this.dropdown1.dismiss()}>Canvas2D</li></RLink>
				<RLink to="/starter"><li onClick={()=>this.dropdown1.dismiss()}>Demo</li></RLink>
			</Dropdown>
			<Dropdown button="tasks" ref={(ref)=>this.dropdown2 = ref as Dropdown} push="left">
				<RLink to="/task"><li onClick={()=>this.dropdown2.dismiss()}>My Tasks</li></RLink>
				<RLink to="/task/manage"><li onClick={()=>this.dropdown2.dismiss()}>Manage Tasks</li></RLink>
				<li>Dashboard (TODO)</li>
			</Dropdown>
			{/*}
			<RLink to="/typescript"><div className="button">Typescript</div></RLink>
			<RLink to="/students"><div className="button">Students</div></RLink>
			{*/}
			<RLink to="/login"><div className="button" onClick={this.logout}>{this.props.userid?"logout":"Login"}</div></RLink>
		</NavBar>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		userid: state.user.userid
	};
}
export let Header = connect(mapStateToProps)(_Header);