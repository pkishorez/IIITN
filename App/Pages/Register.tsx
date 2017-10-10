import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Select} from 'classui/Components/Form/Select';
import {SRegisterUser} from '../../Server/Database/Schema';
import {Flash} from 'classui/Components/Flash';
import {User} from '../User';
import {RouteComponentProps, Link} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};
export class Register extends React.Component<IProps, IState> {
	componentDidMount() {
		Flash.flash((dismiss)=><RegisterComponent />, true);
	}
	render() {
		return null;
	}
}

class RegisterComponent extends React.Component<any, any>{
	register(data: any) {
		User.register(data).then((data)=>console.log(data), (error)=>{console.log(error)})
	}
	render() {
		return <div style={{minWidth: 230}}>
			<Link to="/login"><div className="button">Login here.</div></Link>
			<Formlayout schema={SRegisterUser} label="Register" onSubmit={this.register.bind(this)}>
				<TextField autoFocus name="_id" label="University ID">University ID</TextField>
				<TextField name="name" label="Name">Name</TextField>
				<TextField name="email" label="Email ID">Email</TextField>
				<TextField type="password" name="password" label="Password">Password</TextField>
				Batch : <Select name="batch" options={(SRegisterUser.batch as any).values}></Select>
				<br/>
				Branch : <Select name="branch" options={(SRegisterUser.branch as any).values}></Select>
				<br/>
				<input type="submit"/>
		</Formlayout>
		</div>;
	}
}