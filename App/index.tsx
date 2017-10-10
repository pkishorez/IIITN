import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar} from 'classui/Navbar';
import {Login} from './Pages/Login';
import {Register} from './Pages/Register';
import {Lesson} from './Pages/Lesson';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {SocketIO} from './SocketIO';
interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <BrowserRouter>
			<ClassUI contentWidth={1024}>
				<NavBar fixed logo="Programmer's Club"></NavBar>
				<Content>
					<Switch>
					<Route path="/register" strict exact component={Register} />
					<Route path="/login" strict exact component={Login} />
					<Route path="/lesson" component={Lesson} />
					</Switch>
				</Content>
			</ClassUI>
		</BrowserRouter>;
	}
}