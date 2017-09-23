import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar} from 'classui/Navbar';
import {Login} from './Pages/Login';
import {withRouter, BrowserRouter, Route} from 'react-router-dom';
import * as io from 'socket.io-client';

let Socket = io();

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <BrowserRouter>
			<ClassUI contentWidth={800}>
				<NavBar fixed logo="Programmer's Club"></NavBar>
				<Content>
					<Route  path="/login" strict exact component={Login} />
				</Content>
			</ClassUI>
		</BrowserRouter>;
	}
}