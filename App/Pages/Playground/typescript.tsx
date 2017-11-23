import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from 'App/Monaco';
import {Runtime} from 'App/Monaco/Runtime/';
import {SeqProgramOutput} from 'App/Monaco/SeqProgram';
import {Layout, Section} from 'classui/Components/Layout';
import {PersistMonaco} from 'App/State/Utils/PersistentMonaco';
import * as _ from 'lodash';

interface IProps {
	monaco?: IMonacoProps
};
interface IState {};

export class PlaygroundTypescript extends React.Component<IProps, IState> {
	output: SeqProgramOutput|null;
	constructor(props: any, context: any) {
		super(props, context);
		this.runProgram = this.runProgram.bind(this);
	}
	runProgram(value: string)
	{
		this.output?this.output.runProgram(value):null;
	}
	render() {
		return <Layout align="center" style={{height: "calc(100vh - 50px)"}} gutter={10}>
			<Section remain>
				<PersistMonaco id="PLAYGROUND" {...this.props.monaco} fontSize={15} height="calc(100vh - 150px)" getOutput={this.runProgram}/>
			</Section>
			<Section width={400}>
				<h3 style={{textAlign: "center"}}>Output</h3>
				<SeqProgramOutput debounce={100} ref={(ref)=>{this.output=ref}} style={{
					height: `calc(100vh - 150px)`
				}}/>
			</Section>
		</Layout>;
	}
};