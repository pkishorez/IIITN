import {store} from '../index';
import {User} from '../../MyActions';
import {IMonacoProps, Monaco} from '../../Monaco';
import * as React from 'react';
import * as _ from 'lodash';

interface IProps extends IMonacoProps {
	id: string
	defaultContent?: string
}
export let PersistMonaco = (props: IProps)=>{
	let persist = (value: string)=>{
		if (props.id==""){
			return;
		}
		if (value) {
			User.saveEditorBuffer(props.id, value);
		}
	}
	persist = _.debounce(persist, 500);
	let getOutput = (value: string)=>{
		persist(value);
		if (props.getOutput) {
			props.getOutput(value);
		}
	}
	let stored = store.getState().user.editorBuffers[props.id];
	let content = stored?stored:"";
	if (content.trim()=="") {
		content = props.defaultContent?props.defaultContent:content;
	}

	return <Monaco content={content} {...props} getOutput={getOutput}/>
}