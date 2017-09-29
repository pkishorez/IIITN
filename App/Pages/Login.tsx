import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};

export class Login extends React.Component<IProps, IState> {
	render() {
		return <Layout justify="center"align="center" style={{height: `calc(100vh - 50px)`}}>
			<Section card>
				<Formlayout label="Login" onSubmit={(data: any)=>{console.log(data)}}>
					<TextField autoFocus name="username" label="UserName">Username</TextField>
					<TextField schema={{
						type: "string",
						minLength: 5
					}} type="password" name="password" label="Password">Password</TextField>
					<input type="submit"/>
				</Formlayout>
			</Section>
		</Layout>;
	}
}