import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Formlayout} from 'classui/Components/Formlayout';
import {TextField} from 'classui/Components/Formlayout/TextField';

export interface IProps {
	onSubmit: any
};
export let LoginForm = (props: IProps) => {
	return <Formlayout label="Login" onSubmit={props.onSubmit}>
		<TextField autoFocus name="username" label="UserName">Username</TextField>
		<TextField name="password" label="Password">Password</TextField>
		<input type="submit"/>
	</Formlayout>;
};