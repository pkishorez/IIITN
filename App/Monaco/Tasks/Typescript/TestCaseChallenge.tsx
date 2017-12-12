import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import * as _ from 'lodash';
import * as jsdiff from 'diff';
import {SAnim} from 'classui/Helper/Animation';
import { runProgramInNewScope, Runtime, IFunctionDetails } from 'App/Monaco/Runtime';
import { Layout, Section } from 'classui/Components/Layout';
import { Flash } from 'classui/Components/Flash';
import { PersistMonaco } from 'App/State/Utils/PersistentMonaco';
import {SeqTestcaseOutput} from 'App/Monaco/SeqProgram/SeqTestcaseOutput';
import { ITypescriptTestCaseTask, ITypescriptTestCaseTask_Submission } from 'Server/Database/Schema/Task';
import { DraftEditorRender } from 'App/DraftEditor/Render';
import { connect } from 'App/State';
import { IRootState } from 'App/State/RootReducer';
import { Feedback } from 'classui/Components/Feedback';
import { Me } from 'App/MyActions';

interface IProps extends IStateProps {
	task_id: string
	height: number | string
	monaco?: IMonacoProps
	task: ITypescriptTestCaseTask
};
interface IState {
	taskEditable: boolean
	submitting: boolean
	output: string
	testCasesPassed: number
};

let consoleStyle: React.CSSProperties = {
	position: 'relative',
	whiteSpace: "pre",
	overflowX: "hidden",
	fontSize: 14,
	fontWeight: 900,
	width: "100%",
	lineHeight: 1.6,
	height: "100%",
	fontFamily: "monospace",
	padding: 20,
	margin:0,
	backgroundColor: 'black',
	color: 'cyan'
};

export class TestCaseChallenge_ extends React.Component<IProps, IState> {

	private editorRef: monaco.editor.IStandaloneCodeEditor;
	private SeqTestcaseOutput: SeqTestcaseOutput;
	constructor(props: IProps, context: any) {
		super(props, context);
		let userTaskDetails = props.userTasks?props.userTasks[props.task_id]:undefined as (ITypescriptTestCaseTask_Submission | undefined);
		this.state = {
			submitting: false,
			taskEditable: userTaskDetails?false:true,
			testCasesPassed: 0,
			output: ""
		};
		this.runProgram = this.runProgram.bind(this);
		this.submitCode = this.submitCode.bind(this);
		this.SeqTestcaseOutput = new SeqTestcaseOutput({
			debounce: 100,
			funcDetails: props.task.funcDetails,
			onOutput: (output)=>{
				this.setState({
					output: output.output,
					testCasesPassed: output.testcasesPassed,
				});
			},
			onError: (error)=>{
				this.setState({
					output: error
				});
			}
		});
	}
	runProgram() {
		this.setState({
			output: "Running..."
		});
		return this.SeqTestcaseOutput.runProgram(this.editorRef.getValue());
	}
	submitCode() {
		this.setState({
			submitting: true
		});
		let code = this.editorRef.getValue();
		this.runProgram().then((data)=>{
			if (data.testcasesPassed==this.props.task.funcDetails.tests.length) {
				// Successfully submitted code.
				Me.submitTask({
					type: "USER_SAVE_TASK",
					taskDetails: {
						_id: this.props.task_id,
						type: "TYPESCRIPT_TESTCASE_TASK",
						code,
						test_cases_passed: data.testcasesPassed
					}
				}).then(()=>{
					Feedback.show("Successfully submitted the code.", "success");
					this.setState({
						submitting: false,
						taskEditable: false
					});
				}).catch((error)=>{
					this.setState({
						submitting: false
					});
					Feedback.show(error, "error");
				})
			}
			else {
				Feedback.show("All test cases should be passed to submit.", "error");
				this.setState({
					submitting: false
				});
			}
		}).catch((error)=>{
			this.setState({
				submitting: false
			});
			Feedback.show("Error in code : "+error+".", "error");			
		});
	}
	render() {
		let answered = this.state.testCasesPassed==this.props.task.funcDetails.tests.length;
		let userTaskDetails = this.props.userTasks[this.props.task_id] as (ITypescriptTestCaseTask_Submission | undefined);
		return <Layout gutter={20} equallySpaced style={{height: this.props.height}}>
			<Section>
				<Layout direction="column" style={{height: this.props.height, width: "100%", backgroundColor: 'white'}} c_props={{style: {width: "100%"}}}>
					<Section>
						<Layout gutter={10} margin={10}>
							<Section style={{
								color: this.state.taskEditable?answered?"darkgreen":"red":"darkgreen",
								fontWeight: 900,
								backgroundColor: 'white',
								padding: "20px 0px"
							}}>
								{this.state.taskEditable?<span>
									{this.state.testCasesPassed} / {this.props.task.funcDetails.tests.length} Test Cases passed.
								</span>:<span>Successfully Submitted the code. <span className="button" onClick={()=>{
									this.setState({
										taskEditable: true
									});
								}}>Retry</span></span>}
							</Section>
							<Section remain></Section>
							<Section>
								{this.state.taskEditable?
								<div className={("button primary "+(this.state.submitting?"disable":""))} onClick={()=>{
									this.submitCode();
								}}>{
									userTaskDetails?"Resubmit Code":"Submit Code"
								}</div>
								:null}
							</Section>
						</Layout>
					</Section>
					<Section remain style={{overflow: "hidden"}}>
					{this.state.taskEditable?
						<PersistMonaco dimensions={{
								height: "100%"
							}}
							defaultContent={this.props.task.resetCode}
							id={this.props.task_id}
							ctrlEnterAction={this.runProgram}
							lineNumbers="on"
							{...this.props.monaco} editorRef={(ref: any)=>this.editorRef=ref}
						/>:
						<Monaco dimensions={{
								height: "100%"
							}}
							content={userTaskDetails?userTaskDetails.code:"// NO SAVED TASK?? ERROR."}
							readOnly
							lineNumbers="on"
							{...this.props.monaco}
						/>
					}
					</Section>
					{this.state.taskEditable?
					<Section basis={100}>
						<div style={consoleStyle} >
							{/*<h4 style={{marginTop: 0, color: 'white'}}>Expected Output: </h4>*/}
							{this.state.output}
						</div>
					</Section>
					:<Section />}
				</Layout>
			</Section>
			<Section style={{maxHeight: this.props.height, overflow: "auto"}}>
				<div style={{backgroundColor: 'white', padding: 10}}>
					<DraftEditorRender contentState={this.props.task.question}/>
				</div>
			</Section>
		</Layout>;
	}
};
interface IStateProps {
	userTasks: IRootState["user"]["taskDetails"]
}

let mapStateToProps = (state: IRootState): IStateProps=>{
	return {
		userTasks: state.user.taskDetails
	}
}
export let TestCaseChallenge = connect(mapStateToProps)(TestCaseChallenge_);