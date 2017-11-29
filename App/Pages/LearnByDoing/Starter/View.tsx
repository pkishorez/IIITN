import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {DraftEditorRender, convertToRaw} from 'App/DraftEditor';
import {connect, IRootState} from 'App/State';
import {IGuide, IModule} from 'App/State/Reducers/GuideReducer';
import { Guide } from 'App/MyActions';

interface IProps extends IGuide{};
interface IState {
	lesson_id: string
};

class StarterView_ extends React.Component<IProps, IState> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			lesson_id: ""
		};
	}
	componentDidMount() {
		Guide.init();
	}
	render() {
		if (this.state.lesson_id=="" && this.props.order[0]) {
			this.setState({
				lesson_id: this.props.order[0]
			})	
		}
		return <Layout style={{maxWidth: 935, margin: 'auto'}} gutter={15} justify="center" align="start">
			<Section minWidth={225}>
				<Menu header="Modules">
					{
						this.props.order.map((lesson_id)=>{
							return <Item active={lesson_id==this.state.lesson_id} onClick={()=>{
								this.setState({
									lesson_id
								})
							}} key={lesson_id}>{this.props.map[lesson_id].title}</Item>
						})
					}
				</Menu>
			</Section>
			<Section remain clsName="card-1" style={{padding: "10px 25px", backgroundColor: 'white'}}>
				<DraftEditorRender contentState={this.props.map[this.state.lesson_id]?this.props.map[this.state.lesson_id].editorState:undefined}/>
			</Section>
		</Layout>;
	}
}

let mapStateToProps = (state: IRootState): IProps=>{
	return {
		...state.guides["STARTER"],
	}
}
export let StarterView = connect(mapStateToProps)(StarterView_);
