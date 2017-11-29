import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from 'App/Monaco';
import { ConsoleTask } from 'App/Monaco/Tasks/Typescript/ConsoleTask';

interface IProps {
	
};
interface IState {};

export class MonacoPractice extends React.Component<IProps, IState> {
	render() {
		return <ConsoleTask expectedOutput="*\n**\n***\n****\n*****  Hello :)"/>;
	}
};