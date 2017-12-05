import { EditorState, AtomicBlockUtils, ContentState, ContentBlock } from "draft-js";
import * as React from 'react';
import {MonacoPractice, IMonacoPracticeProps} from './MonacoPractice';
import { Layout } from "classui/Components/Layout";
import { Formlayout } from "classui/Components/Formlayout";
import { TextField } from "classui/Components/Formlayout/TextField";

interface IAtomicBlock {
	type: "MONACO_PRACTICE" | "SYNTAX_HIGHLIGHT"
	value: any
}

export let AddOrEditAtomicBlock = (editorState: EditorState, atomicBlock: IAtomicBlock): EditorState=>{
	const contentState = editorState.getCurrentContent();
	let block = editorState.getCurrentContent()
	.getBlockForKey(editorState.getSelection().getStartKey());
	if (block.getEntityAt(0)){
		let entity = contentState.getEntity(block.getEntityAt(0));
		// Edit Atomic block if entity already exist :)
		if (entity.getData()) {
			let newContentState = contentState.mergeEntityData(block.getEntityAt(0), {
				data: atomicBlock.value
			});
			return EditorState.push(editorState, newContentState, "apply-entity");
		}		
	}
	const contentStateWithEntity = contentState.createEntity(
		atomicBlock.type,
		'IMMUTABLE',
		{data: atomicBlock.value}
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
			return <MonacoPractice {...data.data} />;
		}
		case "SYNTAX_HIGHLIGHT": {
			return null;
		}
	}
}