import { EditorState, AtomicBlockUtils, ContentState, ContentBlock } from "draft-js";
import * as React from 'react';
import {MonacoPractice} from './MonacoPractice';

interface IAtomicBlock {
	type: "MONACO_PRACTICE"
	value: any
}

export let AddAtomicBlock = (editorState: EditorState, atomicBlock: IAtomicBlock): EditorState=>{
	const contentState = editorState.getCurrentContent();
	const contentStateWithEntity = contentState.createEntity(
		atomicBlock.type,
		'IMMUTABLE',
		atomicBlock.value
	);
	const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
	let newEditorState = EditorState.set(
		editorState,
		{currentContent: contentStateWithEntity}
	);

	return AtomicBlockUtils.insertAtomicBlock(
		newEditorState,
		entityKey,
		' '
	)
}

interface IRenderAtomicBlockProps {
	contentState: ContentState
	block: ContentBlock
}
export let AtomicBlock = (props: IRenderAtomicBlockProps)=>{
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0)
	);
	const data = entity.getData();
	const type = entity.getType() as IAtomicBlock["type"];
	switch(type) {
		case "MONACO_PRACTICE": {
			return <MonacoPractice {...data} />;
		}
	}
}