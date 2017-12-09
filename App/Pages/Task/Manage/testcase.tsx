import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {ITask, ITypescriptTestCaseTask} from 'Server/Database/Schema/Task';
import { OrderedMapList } from 'classui/Components/OrderedMapList';
import { EditorState, DraftEditor, convertToRaw } from 'App/DraftEditor';
import { Monaco } from 'App/Monaco';
import { S_FunctionDetails } from 'App/Monaco/Runtime/Tasks';
import { IFunctionDetails } from 'App/Monaco/Runtime';

export let AddOrEditTypescriptTestcaseTask = (props: Partial<ITypescriptTestCaseTask>, task_id?: string)=>{
	let resetCode: string;
	let resetCodeRef: monaco.editor.IStandaloneCodeEditor;
	let questionState: string = JSON.stringify(convertToRaw(EditorState.createEmpty().getCurrentContent()));
	let titleInput: HTMLInputElement|null;
	let funcDetailsRef: monaco.editor.IStandaloneCodeEditor;


	Flash.flash((dismiss)=>{
		let saveDetails = ()=>{
			let task: ITypescriptTestCaseTask = {
				title: titleInput?titleInput.value:"",
				type: "TYPESCRIPT_TESTCASE_TASK",
				question: questionState,
				resetCode: resetCodeRef.getValue(),
				funcDetails: JSON.parse(funcDetailsRef.getValue())
			};
			if (typeof task.funcDetails=="object") {
				(task.funcDetails as any)["$schema"] = undefined;
			}
			if (task_id) {
				TaskAction.perform({
					type: "TASK_ACTION",
					orderedMapAction: {
						type: "MODIFY",
						_id: task_id,
						value: task
					}
				}).then(dismiss);
			}
			else {
				TaskAction.perform({
					type: "TASK_ACTION",
					orderedMapAction: {
						type: "ADD",
						value: task
					}
				}).then(dismiss);
			}
		};
		return <Layout direction="column" basis="100vh" style={{backgroundColor: "white"}}>
			<Section>
				<Layout justify="center" style={{margin: "auto", padding: "20px 0px", width: 500}}>
					<Section>
						<input name="title" defaultValue={props.title} ref={(ref)=>titleInput=ref} type="text" style={{border: "1px solid black", width: 400, padding: 10}} placeholder="Title"/>
					</Section>
					<Section>
						<input type="button" value="Save" onClick={saveDetails} />
					</Section>
				</Layout>
			</Section>
			<Section remain>
				<Layout basis="100%" margin={20} gutter={10} align="start" equallySpaced style={{width: 1024, maxWidth: "100%", height: "100%"}}>
					<Section style={{height: "100%"}}>
						<DraftEditor height="100%" defaultState={props.question} onChange={(state)=>questionState=JSON.stringify(convertToRaw(state.getCurrentContent()))}/>
					</Section>
					<Section style={{height: "100%"}}>
						<Layout direction="column" basis="100%" style={{overflow:"auto"}}>
							<Section remain>
								<Monaco style={{
									overflowX: "hidden",
									height: "100%",
									minHeight: 200
								}} content={props.funcDetails?JSON.stringify(props.funcDetails, undefined, "\t"):`{\t"$schema": "http://cseclub/functionDetails"\n}`} language="json" editorRef={(ref: any)=>funcDetailsRef=ref} schema={S_FunctionDetails}/>
							</Section>
							<Section style={{maxHeight: "100%"}}>
								<Monaco content={props.resetCode?props.resetCode:`function func_name(params) {\n}`} editorRef={(ref: any)=>resetCodeRef=ref}
								autoResize
								dimensions={{
									minHeight: 100,
									maxHeight: 300
								}} />
							</Section>
						</Layout>
					</Section>
				</Layout>
			</Section>
		</Layout>;
	}, true, true);
}