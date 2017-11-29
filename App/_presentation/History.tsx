import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Redirect, withRouter, RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};

export class History extends React.Component<IProps, IState> {
	private static instance: History;

	constructor(props: any, context: any) {
		if (History.instance) {
			console.error("Only one instance of History should be rendered.");
			return;
		}
		super(props, context);
		History.instance = this;
	}
	static get props() {
		if (!this.instance) {
			console.error("History component should be mounted First to access props.");
			return null;
		}
		return this.instance.props;
	}
	render() {
		return null;
	}
}

export let History_ = withRouter<IProps>(History);