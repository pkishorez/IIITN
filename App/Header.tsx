import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {NavBar, NavbarRemain} from 'classui/Navbar';
import {RLink} from 'classui/Helper/RLink';
import {connect} from 'react-redux';
import {IRootState} from './State/RootReducer';
import {store, A_User} from './State';

interface IProps {
	userid: string | null
};
interface IState {};

class _Header extends React.Component<IProps, IState> {
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
			<RLink to="/lesson"><div className="button">Lessons</div></RLink>
			<RLink to="/students"><div className="button">Students</div></RLink>
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