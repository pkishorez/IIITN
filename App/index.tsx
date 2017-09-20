import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from 'classui/ClassUI';
import {Content} from 'classui/Content';
import {NavBar} from 'classui/Navbar';

interface IProps {};
export class App extends React.Component<IProps, any>
{
	render()
	{
		return <ClassUI>
			<NavBar logo="Class-UI"></NavBar>
			<Content></Content>
		</ClassUI>
	}
}