import {highlightBlock} from 'highlight.js';
import * as React from 'react';

interface ISyntaxHighlight {
	blockProps?: any
	children: string
}
export let SyntaxHighlight = (props: ISyntaxHighlight)=>{
	return <code className="typescript" style={{
		fontFamily: "Inconsolata",
		backgroundColor: 'rgba(0,0,0,0.03)',
		whiteSpace: "pre-wrap",
		padding: 10
	}} ref={(ref)=>{
		ref?highlightBlock(ref):null;
	}}>{props.blockProps?props.blockProps.children:props.children}</code>;
}