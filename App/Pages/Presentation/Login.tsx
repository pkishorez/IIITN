import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Flash} from 'classui/Components/Flash';
import {RouteComponentProps, Redirect, Link} from 'react-router-dom';
import {SLoginUser} from '../../Server/Database/Schema';
import {User} from '../User';

interface IProps {
	redirect?: string
};
interface IState {
	error?: string
};

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
	constructor() {
		super();
		this.state = {
			error: undefined
		};
	}
	login(data: any) {
		User.login(data).then((response: string)=>{
			console.log(response);
		}, (error: string)=>{
			console.log(error);
			this.setState({
				error
			});
		});
	}
	render(){
		return <div>
			<Link to="/register"><div className="button">Register Here.</div></Link>
			<Formlayout schema={SLoginUser} onSubmit={this.login.bind(this)} label="Login">
				{this.state.error?<h5 style={{color: 'red'}}>{this.state.error}</h5>:null}
				<TextField autoFocus name="_id" label="UserName (University ID)">Username</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				<input type="submit"/>
			</Formlayout>
		</div>;
	}
}