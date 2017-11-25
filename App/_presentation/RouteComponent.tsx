import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Login, Register, Profile, Students, LearnByDoing, StarterView, StarterManagement} from 'App/Pages';
import {Home} from 'App/Pages/Presentation/Home';
import {RequireAuthentication} from 'App/Pages/Presentation/Login';
import {Lesson} from 'App/Pages/Lesson';
import {Typescript} from 'App/Pages/Typescript';
import {PlaygroundTypescript, PlaygroundCanvas2D, PlaygroundCanvas2dStarter} from 'App/Pages/Playground/';
import {Task, TaskManager} from 'App/Pages/Task/';
import {GetState} from 'App/State';
import {AddQuestion} from 'App/Pages/Questions';
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
			<Route path="/lbd/starter/manage" component={StarterManagement} />
			<Route path="/lbd/starter" component={StarterView} />
			<Route path="/lbd" component={LearnByDoing} />
			<Route path="/typescript" component={Typescript} />
			<Route path="/questions" component={AddQuestion} />
			<Route path="/students" component={Students} />
			<Route path="/" strict exact render={()=>{return <Redirect to="/playground"/>}}/>
			{/* Authenticated Components goes here...*/}
			<Route render={(props)=>{
				if (!GetState().user.userid) {
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