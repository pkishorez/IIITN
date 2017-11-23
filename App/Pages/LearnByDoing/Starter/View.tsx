import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {DraftEditorRender, convertToRaw} from 'App/DraftEditor';
import {connect, IRootState} from 'App/State';
import {ILessons, ILesson} from 'App/State/Reducers/GuideReducer';

interface IProps extends ILessons{};
interface IState {
	lesson_id: string
};

class StarterView_ extends React.Component<IProps, IState> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			lesson_id: ""
		};
	}
	render() {
		return <Layout style={{maxWidth: 935, margin: 'auto'}} gutter={15} justify="center" align="start">
			<Section minWidth={225}>
				<div className="hideOnHover">
					<Menu header="Modules">
						{
							Object.keys(this.props.lessons).map((lesson_id)=>{
								return <Item active={lesson_id==this.state.lesson_id} onClick={()=>{
									this.setState({
										lesson_id
									})
								}} key={lesson_id}>{this.props.lessons[lesson_id].title}</Item>
							})
						}
					</Menu>
				</div>
			</Section>
			<Section remain clsName="card-1" style={{padding: 10, backgroundColor: 'white'}}>
				<DraftEditorRender contentState={this.props.lessons[this.state.lesson_id]?this.props.lessons[this.state.lesson_id].editorState:undefined}/>
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		lessons: state.guides["STARTER"].lessons,
		order: state.guides["STARTER"].order
	}
}
export let StarterView = connect(mapStateToProps)(StarterView_);
