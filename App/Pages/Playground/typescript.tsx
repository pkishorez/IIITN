import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import {Runtime} from 'App/Monaco/Runtime/';
import {SeqProgramOutput} from 'App/Monaco/SeqProgram';
import {Layout, Section} from 'classui/Components/Layout';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import * as _ from 'lodash';
import { Flash } from 'classui/Components/Flash';

interface IProps {
	monaco?: IMonacoProps
	width?: string | number
	mainHeight?: string | number
	playHeight?: string | number
	outputHeight?: string | number
};
interface IState {};

export class PlaygroundTypescript extends React.Component<IProps, IState> {
	output: SeqProgramOutput|null;
	static defaultProps: IProps = {
		width: "100%",
		playHeight: "calc(100vh - 150px)",
		outputHeight: "calc(100vh - 150px)",
		mainHeight: "calc(100vh - 50px)",
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.runProgram = this.runProgram.bind(this);
	}
	runProgram(value: string)
	{
		this.output?this.output.runProgram(value):null;
	}
	render() {
		return <Layout align="center" style={{height: this.props.mainHeight, width: this.props.width}} gutter={10}>
			<Section remain>
				<PersistMonaco id="PLAYGROUND" {...this.props.monaco} fontSize={15} dimensions={{
					height: this.props.playHeight
				}} getOutput={this.runProgram}/>
			</Section>
			<Section width={400} style={{}}>
				<SeqProgramOutput debounce={100} ref={(ref)=>{this.output=ref}} style={{
					maxHeight: this.props.outputHeight,
					minHeight: 200
				}}/>
			</Section>
		</Layout>;
	}
};

export let FlashPlaygroundTypescript = ()=>{
	Flash.flash(()=>{
		return <PlaygroundTypescript monaco={{shouldHaveMarginBottom: true, shouldHaveMarginTop: true}} width={1024} playHeight="calc(100vh - 150px)" mainHeight="auto" outputHeight="calc(100vh - 200px)"/>;
	}, false, true, true);
}