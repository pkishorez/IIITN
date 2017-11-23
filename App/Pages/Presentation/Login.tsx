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

interface IProps {
	redirect?: string
};
interface IState {
	error?: string
};

let LoginMessage: string | undefined;
const DEFAULT_REDIRECT_URL: string = "/playground";
let RedirectURL: string = DEFAULT_REDIRECT_URL;

export class Login extends React.Component<IProps, IState> {

	render() {
		return <div>Kishore is a good boy.</div>;
	}
	
	componentDidMount() {
		Flash.flash((dismiss)=>{
			let cwu = this.componentWillUnmount;
			this.componentWillUnmount = ()=>{
				cwu?cwu.apply(this):null;
				dismiss();
			}
			return <Login_ />;
		},
		true);
	}
}

class Login_ extends React.Component<IProps, IState> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			error: undefined
		};
	}
	login(data: any) {
		Me.login(data).then((response: any)=>{
			LoginMessage = undefined;
			(History.props as any).history.replace(RedirectURL);
		}, (error: string)=>{
			console.log(error);
			this.setState({
				error
			});
		});
	}
	render(){
		return <div style={{backgroundColor: "white"}}>
			<Link to="/register"><div className="button">Register Here.</div></Link>
			{LoginMessage?<div style={{color: "darkgreen", margin: 10, marginBottom: 0}}>{LoginMessage}</div>:null}
			<Formlayout style={{width: 270}} schema={S_UserLogin} onSubmit={this.login.bind(this)} label="Login">
				{this.state.error?<h5 style={{color: 'red'}}>{this.state.error}</h5>:null}
				<TextField autoFocus name="userid" label="UserName (University ID)">Username</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				<input type="submit"/>
			</Formlayout>
		</div>;
	}
}

interface IAuthProps {
	message: string,
	redirect?: string
}
export let RequireAuthentication = (props: IAuthProps)=>{
	LoginMessage = props.message;
	RedirectURL = props.redirect?props.redirect:DEFAULT_REDIRECT_URL;
	return <Redirect to={"/login"}/>;
}