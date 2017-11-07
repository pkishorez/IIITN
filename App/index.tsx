import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {Header} from './Header';
import {History_} from './History';
import {RouteComponent} from './RouteComponent';
import {store, IRootState} from './State';
import {User} from './User';
import {ServiceWorker} from './ServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {Provider, connect} from 'react-redux';

if (store.getState().user.userid) {
	// Reestablish session if user is already logged in.
	User.login({
		_id: store.getState().user.userid,
		secretKey: store.getState().user.secretKey
	});	
}
ServiceWorker.initialize();

interface IProps {
	isOffline: boolean
};
let _App = (props: IProps)=>{
	return <BrowserRouter>
		<ClassUI contentWidth={1024} offline={props.isOffline}>
			<History_ />
			<Header />
			<Content>
			<RouteComponent />
			</Content>
		</ClassUI>
	</BrowserRouter>;
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		isOffline: !state.user.online
	}
};

export let App = connect(mapStateToProps)(_App);