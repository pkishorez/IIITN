import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Login, Register, Profile, Students} from './Pages';
import {Home} from './Pages/Home';
import {RequireAuthentication} from './Pages/Presentation/Login';
import {Lesson} from './Pages/Lesson';
import {Typescript} from './Pages/Typescript';
import {Playground} from './Pages/Playground/index';
import {PG2D} from './Pages/Playground/PG2D';
import {Starter} from './Pages/Starter';
import {Task, AddTask} from './Pages/Task';
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
			<Route path="/playground" component={Playground} />
			<Route path="/2dplayground" component={PG2D} />
			<Route path="/starter" component={Starter} />
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
					<Route path="/task/add" component={AddTask}/>
					<Route path="/profile/:userid" render={(props)=><Profile userid={props.match.params.userid}/>} />
				</Switch>;
			}}/>
		</Switch>	}
}