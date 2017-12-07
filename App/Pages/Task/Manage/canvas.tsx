import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import {CanvasView, canvasElemId} from 'App/Canvas';
import {Layout, Section} from 'classui/Components/Layout';
import {Dropdown} from 'classui/Components/Dropdown';
import {Flash} from 'classui/Components/Flash';
import {IRootState, connect} from 'App/State';
import {Task as TaskAction, Me} from 'App/MyActions';
import {ICanvasTask} from 'Server/Database/Schema/Task';
import { OrderedMapList } from 'classui/Components/OrderedMapList';

let defaultCode = `import {Canvas} from 'canvas2d';
import {Rectangle, Circle, Shape, CustomShape} from 'canvas2d/Shapes';

let canvasElem = document.getElementById("${canvasElemId}") as HTMLCanvasElement;
canvasElem.style.backgroundColor = "black";

let canvas = new Canvas(canvasElem, true);
`;

export let AddOrEditCanvasTask = (props: Partial<ICanvasTask>, task_id?: string)=>{
	let resetCodeRef: monaco.editor.IStandaloneCodeEditor|null;
	let questionRef: monaco.editor.IStandaloneCodeEditor|null;
	let input: HTMLInputElement|null;

	props = {
		type: "CANVAS2D",
		question: defaultCode,
		resetCode: defaultCode,
		title: "",
		...props
	};

	Flash.flash((dismiss)=>{
		return <div style={{backgroundColor: "white"}}>
			<Layout justify="center" style={{margin: "auto", padding: "20px 0px", width: 500}}>
				<Section>
					<input defaultValue={props.title} ref={(ref)=>input=ref} type="text" style={{border: "1px solid black", width: 400, padding: 10}} placeholder="Title"/>
				</Section>
				<Section>
					<div className="button" onClick={()=>{
						let task: ICanvasTask = {
							title: input?input.value:"",
							type: "CANVAS2D",
							question: questionRef?questionRef.getValue():"",
							resetCode: resetCodeRef?resetCodeRef.getValue():""
						};
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
					}}>Save</div>
				</Section>
			</Layout>
			<Layout gutter={20} equalWidth style={{width: 1024, maxWidth: "100%"}}>
				<Section style={{position: 'relative'}}>
					<PersistMonaco autoResize={false} id={task_id?"":"task_canvas_question_buffer"} shouldHaveMarginBottom dimensions={{
						height: 500
					 }} editorRef={(ref: any)=>questionRef=ref} defaultContent={props.question}/>
					<div className="button" style={{position: "absolute", top: 0, right: 0}} onClick={()=>{
						questionRef?questionRef.setValue(defaultCode):null
					}}>Reset</div>
				</Section>
				<Section style={{position: 'relative'}}>
					<PersistMonaco autoResize={false} id={task_id?"":"task_canvas_resetQuestion_buffer"} shouldHaveMarginBottom dimensions={{
						height: 500
					}} editorRef={(ref: any)=>resetCodeRef=ref} defaultContent={props.resetCode}/>
					<div className="button" style={{position: "absolute", top: 0, right: 0}} onClick={()=>{
						resetCodeRef?resetCodeRef.setValue(defaultCode):null;
					}}>
						Reset
					</div>
				</Section>
			</Layout>
		</div>;
	}, true, true);
}