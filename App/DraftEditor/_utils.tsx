import {ContentBlock} from 'draft-js';
import { AtomicBlock } from 'App/DraftEditor/AtomicBlock';
import { SyntaxHighlight } from 'App/DraftEditor/AtomicBlock/SyntaxHighlight';
import * as Immutable from 'immutable';
import * as Draft from 'draft-js';

export let blockStyleFn = (content: ContentBlock)=>{
	let type = content.getType();
	switch(type) {
		case "unstyled":
			return "nostyle";
	}
	return "";
}
export let blockRenderedFn = (content: ContentBlock)=>{
	let type = content.getType();
	switch(type) {
		case "atomic": return {
			component: AtomicBlock,
			editable: false
		}
	}
	return null;
}

export let RenderBlockRenderedFn = (content: ContentBlock)=>{
	switch(content.getType()) {
		case "code-block": 
		    return {
				component: SyntaxHighlight,
				editable: false,
				props: {
					hey: "Hey man",
					children: content.getText()
				}
			}
	}
	return blockRenderedFn(content);
}