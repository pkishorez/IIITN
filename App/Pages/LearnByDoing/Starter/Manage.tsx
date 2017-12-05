import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Layout, Section} from 'classui/Components/Layout';
import {Menu, Item, Divider} from 'classui/Components/Menu';
import {DraftEditor, convertToRaw} from 'App/DraftEditor';
import {Flash} from 'classui/Components/Flash';
import {connect, IRootState} from 'App/State';
import {IGuide, IModule} from 'App/State/Reducers/GuideReducer';
import {Guide} from 'App/MyActions';
import {OrderedMapList} from 'classui/Components/OrderedMapList';

interface IProps extends IGuide {};
interface IState {};

class StarterManage_ extends React.Component<IProps> {
	componentDidMount() {
		Guide.init();
	}
	render() {
		return <div style={{width: 500, margin: "auto"}}>
			<div className="button" style={{marginTop: 10}} onClick={()=>AddOrEditModule()}>Add Lesson.</div>

			<OrderedMapList onClick={(id)=>{
				AddOrEditModule(id, this.props.map[id])
			}} orderedMap={{map: this.props.map, order: this.props.order}}
			onOrderChange={(order)=>{
				console.log("REOREDERED : ", order);
				Guide.perform({
					type:"GUIDE_MODULE_ACTION",
					guide_id: "STARTER",
					orderedMapAction: {
						type: "REORDER",
						order
					}
				})
			}}
			/>
		</div>
	}
}
let mapStateToProps = (state: IRootState): IProps=>{
	return {
		...state.guides["STARTER"],
	}
}
export let StarterManagement = connect(mapStateToProps)(StarterManage_);

export let AddOrEditModule = (id?: string, module?: IModule)=>{
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
			}).then(dismiss);
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
			}).then(dismiss);
		}
	}
	Flash.flash((d)=>{
		dismiss = d;
		return <Layout style={{width: 720, height: `100vh`, overflow: 'auto', margin: 'auto', backgroundColor: 'white', padding: 20}} gutter={15} justify="center" align="start">
			<Section remain>
				<Layout>
					<Section remain><h3 style={{padding: "0px 10px"}}>Add/Edit Module Here.</h3></Section>
					<Section><div className="button primary" onClick={add}>Save</div></Section>
				</Layout>
				<input autoFocus type="text" ref={(ref)=>input=ref} defaultValue={module?module.title:""} style={{padding: 10, width: "100%", boxSizing: "border-box"}} placeholder="Lesson Title"/>
				<DraftEditor defaultState={module?module.editorState:undefined} onChange={(e)=>{editor=e}} style={{padding: 10}}/>
			</Section>
		</Layout>;
	}, false, true, true, "card-5");
}