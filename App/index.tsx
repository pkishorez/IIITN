import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar, NavbarRemain} from 'classui/Navbar';
import {Login, Register, Profile, Students} from './Pages';
import {RequireAuthentication} from './Pages/Presentation/Login';
import {Lesson} from './Pages/Lesson';
import {Typescript} from './Pages/Typescript';
import {Home} from './Pages/Home';
import {Header} from './Header';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {store} from './State';
import {History_} from './History';
import {Provider} from 'react-redux';

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <Provider store={store}>
			<BrowserRouter>
				<ClassUI contentWidth={1024}>
					<History_ />
					<Header />
					<Content>
						<Switch>
							<Route path="/home" strict exact component={Home} />
							<Route path="/register" strict exact component={Register} />
							<Route path="/login" strict exact component={Login} />
							{/* Authenticated Components goes here...*/}
							<Route render={(props)=>{
								if (!store.getState().user.userid) {
									return <RequireAuthentication message="Please login to continue." redirect={props.location.pathname}/>;
								}
								return <Switch>
									<Route path="/lesson" component={Lesson} />
									<Route path="/typescript" component={Typescript} />
									<Route path="/profile/:userid" render={(props)=><Profile userid={props.match.params.userid}/>} />
									<Route path="/students" component={Students} />
									<Route render={()=>{return <Redirect to="/typescript"/>}}/>
								</Switch>;
							}}/>
						</Switch>
					</Content>
				</ClassUI>
			</BrowserRouter>
		</Provider>;
	}
}