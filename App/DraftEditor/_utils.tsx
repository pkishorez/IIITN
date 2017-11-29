import {ContentBlock} from 'draft-js';
import { AtomicBlock } from 'App/DraftEditor/AtomicBlock';

export let blockStyleFn = (content: ContentBlock)=>{
	let type = content.getType();
	switch(type) {
		case "unstyled":
			return "nostyle";
	}
	return "";
}
export let blockRenderedFn = (content: ContentBlock)=>{
	if (content.getType()=="atomic") {
		// Render atomic components here.
		return {
			component: AtomicBlock,
			editable: false
		};
	}
	return null;
}