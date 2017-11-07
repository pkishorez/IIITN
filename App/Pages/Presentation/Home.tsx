import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';

interface IProps {};
interface IState {};

export class Home extends React.Component<IProps, IState> {
	render() {
		return <div>
			This is home page.
			<Link to="/login">Login</Link>
		</div>;
	}
};