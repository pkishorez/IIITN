import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {User} from '../../User';

interface IProps {};
interface IState {};

export class Profile extends React.Component<IProps, IState> {
	componentDidMount() {
		
	}
	render() {
		return <Layout c_props={{card: true}} gutter={20} justify="center">
			<Section width={600}>
				<h4>Bala Kishore Polamarasetty</h4>
				<h5>Age : 25</h5>
				<h5>Class : E4 CSE-6</h5>
				<h5>Learning Progress : 50%</h5>
			</Section>
		</Layout>;
	}
};