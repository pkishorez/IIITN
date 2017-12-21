import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect, withRouter, RouteComponentProps} from 'react-router-dom';
import {History} from './History';
import {getRouteDetails, DEFAULT_REDIRECT_URL} from './Routes';
import { RLink } from 'classui/Helper/RLink';
import { GetState } from 'App/State';
import { RequireAuthentication } from 'App/Pages/Presentation/Login';

interface IProps {};
interface IState {};

let routeDetails = getRouteDetails();

export class RouteComponent extends React.Component<IProps, IState> {
	render() {
		let routes = Object.keys(routeDetails).map((path)=>{
			let route = routeDetails[path];
			switch(route.role) {
				case "USER": {
					if  (GetState().user.userid)
						return <Route key={path} exact path={path} component={route.component}/>
				}
				case "ADMIN": {
					if (GetState().user.userid=="admin")
						return <Route key={path} exact path={path} component={route.component}/>;
					return <Route key={path} exact path={path} render={()=>{
						return <Redirect to={DEFAULT_REDIRECT_URL}/>
					}}/>
				}
			}
			return <Route exact key={path} path={path} component={route.component}/>;
		});

		return <Switch>
			{routes}
			<Route render={()=><Redirect to={DEFAULT_REDIRECT_URL}/>}/>
		</Switch>;
	}
}

interface IRouteButtonProps {
	to: string
	children: React.ReactElement<any>
};

export class RouterButton extends React.Component<IRouteButtonProps> {
	render() {
		return React.cloneElement(this.props.children, {
			onClick: (e: any)=>{
				if (this.props.children.props.onClick)
					this.props.children.props.onClick(e);
				// Authorize action.
				if (!routeDetails[this.props.to]) {
					console.error("Route : ", this.props.to, "NOT FOUND.");
					return;
				}
				switch(routeDetails[this.props.to].role) {
					case "USER": {
						if (GetState().user.userid) {
							History.props.history.push(this.props.to);
							return;
						}
						RequireAuthentication({
							redirect: this.props.to,
							message: "Please login to continue."
						});
						return;
					}
					case "ADMIN": {
						if (GetState().user.userid=="admin") {
							History.props.history.push(this.props.to);
							return;
						}
						RequireAuthentication({
							redirect: this.props.to,
							message: "This action needs admin login."
						});
						return;
					}
				}
				History.props.history.push(this.props.to);
			}
		});
	}
}