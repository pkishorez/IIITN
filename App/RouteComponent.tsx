import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Login, Register, Profile, Students} from './Pages';
import {Home} from './Pages/Presentation/Home';
import {RequireAuthentication} from './Pages/Presentation/Login';
import {Lesson} from './Pages/Lesson';
import {Typescript} from './Pages/Typescript';
import {PlaygroundTypescript, PlaygroundCanvas2D, PlaygroundCanvas2dStarter} from './Pages/Playground/';
import {Task, TaskManager} from './Pages/Task';
import {store} from './State';
import {AddQuestion} from './Pages/Questions';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

interface IProps {};
interface IState {};

export class RouteComponent extends React.Component<IProps, IState> {
	render() {
		return <Switch>
			<Route path="/home" strict exact component={Home} />
			<Route path="/register" strict exact component={Register} />
			<Route path="/login" strict exact component={Login} />
			<Route path="/playground" component={PlaygroundTypescript} />
			<Route path="/2dplayground" component={PlaygroundCanvas2D} />
			<Route path="/starter" component={PlaygroundCanvas2dStarter} />
			<Route path="/lesson" component={Lesson} />
			<Route path="/typescript" component={Typescript} />
			<Route path="/questions" component={AddQuestion} />
			<Route path="/students" component={Students} />
			<Route path="/" strict exact render={()=>{return <Redirect to="/playground"/>}}/>
			{/* Authenticated Components goes here...*/}
			<Route render={(props)=>{
				if (!store.getState().user.userid) {
					return <RequireAuthentication message="Please login to continue." redirect={props.location.pathname}/>;
				}
				return <Switch>
					<Route path="/task" exact component={Task}/>
					<Route path="/task/manage" component={TaskManager}/>
					<Route path="/profile/:userid" render={(props)=><Profile userid={props.match.params.userid}/>} />
				</Switch>;
			}}/>
		</Switch>	}
}