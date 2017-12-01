import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Flash} from 'classui/Components/Flash';
import {RouteComponentProps, Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {S_UserLogin} from 'Server/Database/Schema';
import {Me} from 'App/MyActions';
import {History} from 'App/_presentation/History';
import { Register } from 'App/Pages';

interface IProps {
	message?: string
	redirect?: string
	loggedIn: ()=>void
};
interface IState {
	error?: string
};

class Login extends React.Component<IProps, IState> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			error: undefined
		};
	}
	login(data: any) {
		Me.login(data).then((response: any)=>{
			if (this.props.redirect) {
				History.props.history.replace(this.props.redirect);
			}
			this.props.loggedIn();
		}, (error: string)=>{
			this.setState({
				error
			});
		});
	}
	render(){
		return <div style={{backgroundColor: "white"}}>
			<div className="button" onClick={Register}>Register Here.</div>
			{this.props.message?<div style={{color: "darkgreen", margin: 10, marginBottom: 0}}>{this.props.message}</div>:null}
			<Formlayout style={{width: 270, marginTop: 0}} schema={S_UserLogin} onSubmit={this.login.bind(this)} label="Login">
				{this.state.error?<h5 style={{color: 'red'}}>{this.state.error}</h5>:null}
				<TextField autoFocus name="userid" label="UserName (University ID)">Username</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				<input type="submit"/>
			</Formlayout>
		</div>;
	}
}

let lastProps: Partial<IProps>;
export let RequireAuthentication = (props?: Partial<IProps>, loggedIn?: ()=>void)=>{
	props = {
		...lastProps,
		...props
	};
	lastProps = props;

	Flash.flash((dismiss)=>{
		return <Login {...props} loggedIn={()=>{
			dismiss();
		}}/>
	})
}