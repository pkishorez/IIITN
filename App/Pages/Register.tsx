import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';
import {Select} from 'classui/Components/Form/Select';
import {RouteComponentProps} from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {};
interface IState {};

export class Register extends React.Component<IProps, IState> {
	render() {
		return <Layout justify="center"align="center" style={{height: `calc(100vh - 50px)`}}>
			<Section card>
				<Formlayout label="Register" onSubmit={(data: any)=>{console.log(data)}}>
					<TextField schema={{
						type: "string",
						minLength: 7,
						maxLength: 7
					}} autoFocus name="username">University ID</TextField>
					<TextField name="name">Name</TextField>
					<TextField type="password" name="password">Password</TextField>
					<TextField type="password" name="cnfpassword">Confirm Password</TextField>
					Batch : <Select name="batch" options={["E1", "E2", "E3", "E4"]}></Select>
					<br/>
					<input type="submit"/>
				</Formlayout>
			</Section>
		</Layout>
	}
}