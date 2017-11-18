import {GetState} from '../index';
import {Me} from '../../MyActions';
import {IMonacoProps, Monaco} from '../../Monaco';
import * as React from 'react';
import * as _ from 'lodash';

interface IProps extends IMonacoProps {
	id: string
	defaultContent?: string
}

export class PersistMonaco extends React.Component<IProps, any> {
	constructor(props: any, context: any) {
		super(props, context);
		this.getOutput = this.getOutput.bind(this);

		this.persist = _.debounce(this.persist.bind(this), 500);
	}
	loadContent(props: IProps) {
		let stored = GetState().user.editorBuffers[props.id];
		let content = stored?stored:"";
		if (content.trim()=="") {
			content = props.defaultContent?props.defaultContent:content;
		}
		return content
	}
	componentWillReceiveProps(nextProps: IProps) {
		if (nextProps.id!=this.props.id) {
			let content = this.loadContent(nextProps);
		}
	}
	persist(value: string){
		if (this.props.id==""){
			return;
		}
		if (value) {
			Me.saveEditorBuffer(this.props.id, value);
		}
	}
	getOutput(value: string) {
		this.persist(value);
		if (this.props.getOutput) {
			this.props.getOutput(value);
		}
	}
	componentDidMount() {

	}
	render() {
		return <Monaco content={this.loadContent(this.props)} {...this.props} getOutput={this.getOutput}/>;
	}
}