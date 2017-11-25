import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {DraftEditor, convertToRaw} from 'App/DraftEditor';
import {Flash} from 'classui/Components/Flash';
import {connect, IRootState} from 'App/State';
import {IGuide, IModule} from 'App/State/Reducers/GuideReducer';
import {Guide} from 'App/MyActions';

interface IProps extends IGuide {};
interface IState {};

class StarterManage_ extends React.Component<IProps> {
	componentDidMount() {
		Guide.init();
	}
	render() {
		return <div>
			<div className="button" style={{marginTop: 10}} onClick={()=>AddOrEditLesson()}>Add Lesson.</div>
			{
				this.props.order.map((id)=>{
					return <div key={id} style={{marginTop: 10}} className="button"
					onClick={()=>AddOrEditLesson(id, this.props.map[id])}>
						{this.props.map[id].title}
					</div>
				})
			}
		</div>
	}
}
let mapStateToProps = (state: IRootState): IProps=>{
	return {
		...state.guides["STARTER"],
	}
}
export let StarterManagement = connect(mapStateToProps)(StarterManage_);

export let AddOrEditLesson = (id?: string, lesson?: IModule)=>{
	let input: HTMLInputElement|null, editor: any, dismiss: any;
	let add = () => {
		if (!input || input.value.trim()=="") {
			alert("Please give title.");
			return;
		}
		let title = input.value;
		let editorState = JSON.stringify(convertToRaw(editor.getCurrentContent()));
		if (id) {
			Guide.perform({
				type: "GUIDE_MODULE_ACTION",
				guide_id: "STARTER",
				orderedMapAction: {
					type: "MODIFY",
					_id: id,
					value: {
						title,
						editorState
					}
				}
			})
		}
		else {
			Guide.perform({
				type: "GUIDE_MODULE_ACTION",
				guide_id: "STARTER",
				orderedMapAction: {
					type: "ADD",
					value: {
						editorState,
						title
					}
				}
			});
		}
		dismiss();
	}
	Flash.flash((d)=>{
		dismiss = d;
		return <Layout style={{width: 700, margin: 'auto', backgroundColor: 'white', padding: 10}} gutter={15} justify="center" align="start">
			<Section remain>
				<Layout>
					<Section remain><h3 style={{padding: "0px 10px"}}>Add/Edit Module Here.</h3></Section>
					<Section><div className="button" onClick={add}>Save</div></Section>
				</Layout>
				<input autoFocus type="text" ref={(ref)=>input=ref} defaultValue={lesson?lesson.title:""} style={{padding: 10}} placeholder="Lesson Title"/>
				<DraftEditor defaultState={lesson?lesson.editorState:undefined} onChange={(e)=>{editor=e}} style={{padding: 10}}/>
			</Section>
		</Layout>;
	}, false, false, "card-5");
}