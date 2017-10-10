import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Flash} from 'classui/Components/Flash';
import {RouteComponentProps, Redirect, Link} from 'react-router-dom';
import {SLoginUser} from '../../Server/Database/Schema';
import {User} from '../User';

interface IProps extends RouteComponentProps<any> {
	redirect?: string
};
interface IState {};

export class Login extends React.Component<IProps, IState> {
	private dismiss: any;
	render() {
		return <div>Kishore is a good boy.</div>;
	}
	login(data: any) {
		User.login(data).then(console.log, console.error);
	}
	componentDidMount() {
		Flash.flash((dismiss)=>{
			this.dismiss = dismiss;
			return <div>
				<Link to="/register"><div className="button">Register Here.</div></Link>
				<Formlayout schema={SLoginUser} onSubmit={this.login.bind(this)} label="Login">
					<TextField autoFocus name="_id" label="UserName (University ID)">Username</TextField>
					<TextField type="password" name="password" label="Password">Password</TextField>
					<input type="submit"/>
				</Formlayout>
			</div>
		},
		true);
	}
	componentWillUnmount() {
		if (this.dismiss) {
			console.log("Dismissing...");
			this.dismiss();
		}
	}
}