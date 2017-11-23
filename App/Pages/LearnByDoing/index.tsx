import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {RLink} from 'classui/Helper/RLink';
export {StarterManagement, StarterView} from './Starter';

interface IProps {};
interface IState {};

export class LearnByDoing extends React.Component<IProps, IState> {
	render() {
		let buttonStyle: React.CSSProperties = {
			padding: '30px 0px',
			textAlign: 'center',
			fontSize: 25
		};
		return <Layout style={{height: `calc(100vh - 50px)`}} direction="column" gutter={20} align="center" justify="center">
			<Section style={{width: 400}}>
				<RLink to="/lbd/starter"><div className="button primary" style={buttonStyle}>Basics</div></RLink>
			</Section>
			<Section style={{width: 400}}>
				<div className="button primary disable" style={buttonStyle}>Level-2</div>
			</Section>
			<Section style={{width: 400}}>
				<div className="button primary disable" style={buttonStyle}>Level-3</div>
			</Section>
	</Layout>;
	}
}