import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Monaco, IMonacoProps} from '../../Monaco';
import {Runtime} from '../../Monaco/Runtime';
import {SeqProgramOutput} from '../../Monaco/SeqProgram';
import {Layout, Section} from 'classui/Components/Layout';
import * as _ from 'lodash';

interface IProps {
	monaco?: IMonacoProps
};
interface IState {};

export class PlaygroundTypescript extends React.Component<IProps, IState> {
	output: SeqProgramOutput|null;
	constructor()
	{
		super();
		this.saveContent = _.debounce(this.saveContent.bind(this), 500, {
			trailing: true,
			leading: true
		});
		this.runProgram = this.runProgram.bind(this);
		console.log(this.output);
	}
	saveContent(value: string) {
		if (value){
			localStorage.setItem("PLAYGROUND", value);			
		}
	}
	runProgram(value: string)
	{
		this.saveContent(value);
		this.output?this.output.runProgram(value):null;
	}
	render() {
		let oldContent = localStorage.getItem("PLAYGROUND");
		let monacoprops: IMonacoProps = {
			...this.props.monaco,
			content: oldContent?oldContent:""
		};
		return <Layout align="center" style={{height: "calc(100vh - 50px)"}} gutter={10}>
			<Section remain>
				<Monaco {...monacoprops} fontSize={15} height="calc(100vh - 150px)" getOutput={this.runProgram}/>
			</Section>
			<Section width={400} card>
				<h3 style={{textAlign: "center"}}>Output</h3>
				<SeqProgramOutput debounce={100} ref={(ref)=>{this.output=ref}} style={{
					height: `calc(100vh - 150px)`
				}}/>
			</Section>
		</Layout>;
	}
};