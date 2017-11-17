import {store} from '../index';
import {User} from '../../MyActions';
import {IMonacoProps, Monaco} from '../../Monaco';
import * as React from 'react';
import * as _ from 'lodash';

interface IProps extends IMonacoProps {
	id: string
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
	let content = store.getState().user.editorBuffers[props.id];
	content = content?content:"";
	return <Monaco content={content} {...props} getOutput={getOutput}/>
}