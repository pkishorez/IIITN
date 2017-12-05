import { Flash } from 'classui/Components/Flash';
import * as React from 'react';
import { Layout, Section } from 'classui/Components/Layout';
import { RouterButton } from 'App/_presentation/RouteComponent';

export {TasksTypescriptView} from './typescript';
export {TasksCanvasView} from './canvas';

export class TasksView extends React.Component {
	render() {
		let buttonStyle: React.CSSProperties = {
			padding: '30px 0px',
			textAlign: 'center',
			fontSize: 25
		};
		return <Layout style={{height: `calc(100vh - 50px)`}} direction="column" gutter={20} align="center" justify="center">
			<Section style={{width: 400}}>
				<RouterButton to="/task/basics"><div className="button primary" style={buttonStyle}>Basics</div></RouterButton>
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