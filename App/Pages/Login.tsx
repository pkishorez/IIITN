import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {LoginForm} from '../Partial/LoginForm';
import {Monaco} from '../Monaco';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};

export class Login extends React.Component<IProps, IState> {
	render() {
		return <Layout justify="center"align="center" style={{height: `calc(100vh - 50px)`}}>
			<Section card>
				<LoginForm onSubmit={(data: any)=>{console.log("HELLO", data)}}/>
			</Section>
		</Layout>;
	}
}