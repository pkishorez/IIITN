import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar} from 'classui/Navbar';
import {Login} from './Pages/Login';
import {withRouter} from 'react-router';


interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <ClassUI contentWidth={1024}>
			<NavBar fixed logo="Programmer's Club"></NavBar>
			<Content>
				<Login/>
			</Content>
		</ClassUI>;
	}
}

class _Dummy extends React.Component<{}, {}> {
	render() {
		return <div>
			{this.props}
		</div>;
	}
}

let Dummy = withRouter(_Dummy);