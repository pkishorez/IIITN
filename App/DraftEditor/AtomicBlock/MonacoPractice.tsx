import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco} from 'App/Monaco';
import { ConsoleTask } from 'App/Monaco/Tasks/Typescript/ConsoleTask';

export interface IMonacoPracticeProps {
	expectedOutput: string
	eid: string
};
interface IState {};

export class MonacoPractice extends React.Component<IMonacoPracticeProps, IState> {
	constructor(props: IMonacoPracticeProps, context: any) {
		super(props, context);
	}
	render() {
		return <ConsoleTask {...this.props}/>;
	}
};