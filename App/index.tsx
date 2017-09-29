import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar} from 'classui/Navbar';
import {Login} from './Pages/Login';
import {Register} from './Pages/Register';
import {withRouter, BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {SocketIO} from './SocketIO';
interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <BrowserRouter>
			<ClassUI contentWidth={800}>
				<NavBar fixed logo="Programmer's Club"></NavBar>
				<Content>
					<Switch>
					<Route  path="/login" strict exact component={Login} />
					<Route  path="/register" strict exact component={Register} />
					<Route render={(props)=>{console.log(props);return <Redirect from="" to="/login"></Redirect>}} />
					</Switch>
				</Content>
			</ClassUI>
		</BrowserRouter>;
	}
}