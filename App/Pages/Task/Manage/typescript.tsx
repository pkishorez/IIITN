import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {ITask, ITypescriptTask} from 'Server/Database/Schema/Task';
import { OrderedMapList } from 'classui/Components/OrderedMapList';
import { EditorState, DraftEditor, convertToRaw } from 'App/DraftEditor';

export let AddOrEditTypescriptTask = (props: Partial<ITypescriptTask>, task_id?: string)=>{
	let resetCode: string;
	let questionState: string = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()));
	let titleInput: HTMLInputElement|null;
	let expOutputInput: HTMLTextAreaElement|null;

	Flash.flash((dismiss)=>{
		return <div style={{backgroundColor: "white"}}>
			<Layout align="start" style={{margin: "auto", padding: "20px 0px", width: 500}}>
				<Section>
					<input defaultValue={props.title} ref={(ref)=>titleInput=ref} type="text" style={{border: "1px solid black", width: 400, padding: 10}} placeholder="Title"/>
				</Section>
				<Section>
					<div className="button" onClick={()=>{
						let task: ITask = {
							title: titleInput?titleInput.value:"",
							type: "TYPESCRIPT_EXPOUTPUT",
							question: questionState,
							expectedOutput: expOutputInput?expOutputInput.value:"",
							resetCode: ""
						};
						if (task_id) {
							TaskAction.perform({
								type: "MODIFY",
								_id: task_id,
								value: task
							}).then(dismiss);
						}
						else {
							TaskAction.perform({
								type: "ADD",
								value: task
							}).then(dismiss);
						}
					}}>Save</div>
				</Section>
			</Layout>
			<Layout gutter={20} equallySpaced style={{width: 1024, maxWidth: "100%"}}>
				<DraftEditor style={{padding: 20}} defaultState={props.question} onChange={(state)=>questionState=JSON.stringify(convertToRaw(state.getCurrentContent()))}/>
				<textarea defaultValue={props.expectedOutput} style={{border: "1px solid grey", height: 300}} ref={(ref)=>expOutputInput=ref} placeholder="Expected Output."></textarea>
			</Layout>
		</div>;
	}, true, true);
}