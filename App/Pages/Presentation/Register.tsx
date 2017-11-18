import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Select} from 'classui/Components/Form/Select';
import {S_User} from '../../../Server/Database/Schema';
import {Flash} from 'classui/Components/Flash';
import {Me} from '../../MyActions';
import {RequireAuthentication} from './Login';
import {RouteComponentProps, Link, Redirect} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};
export class Register extends React.Component<IProps, IState> {
	private dismiss: any;
	componentDidMount() {
		Flash.flash((dismiss)=>{
			this.dismiss = dismiss;
			return <RegisterComponent />;
		}, true);
	}
	componentWillUnmount() {
		if (this.dismiss)
			this.dismiss();
	}
	render() {
		return null;
	}
}

class RegisterComponent extends React.Component<any, {error: string, registered: boolean}>{
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			error: "",
			registered: false
		};
	}
	register(data: any) {
		Me.register(data).then(
			(data)=>{
				this.setState({registered: true});
			},
			(error)=>{
				this.setState({error});
			})
	}
	render() {
		if (this.state.registered) {
			return <RequireAuthentication message="User Successfully Registered." />;
		}
		return <div style={{minWidth: 230}}>
			<Link to="/login"><div className="button">Login here.</div></Link>
			<Formlayout style={{width: 270}} schema={S_User} label="Register" onSubmit={this.register.bind(this)}>
			{this.state.error?<h5 style={{color: "red"}}>{this.state.error}</h5>:null}
				<TextField autoFocus name="_id" label="University ID">University ID</TextField>
				<TextField name="name" label="Name">Name</TextField>
				<TextField name="email" label="Email ID">Email</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				Batch : <Select name="batch" options={(S_User.properties as any).batch.enum}></Select>
				<br/>
				Branch : <Select name="branch" options={(S_User.properties as any).branch.enum}></Select>
				<br/>
				<input type="submit"/>
			</Formlayout>
		</div>;
	}
}