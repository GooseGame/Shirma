import { useState } from 'react';
import { RoundButton } from '../../../Button/Button';
import { Sticker } from '../../Sticker/Sticker';
import { TabsProps } from '../Tabs.props';
import styles from './Notes.module.css';
import { AppDispatch } from '../../../../store/store';
import { useDispatch } from 'react-redux';
import { Text } from '../../../../interfaces/Text.interface';
import { charActions } from '../../../../store/slices/Characters.slice';
import { EditTextPopup } from '../../../EditTextPopup/EditTextPopup';

export function Notes({player, onChangeChar}: TabsProps) {
	const [editHeader, setEditHeader] = useState<string>();
	const [editText, setEditText] = useState<Text>();
	const [clickedNId, setClickedNId] = useState<string>();
	const dispatch = useDispatch<AppDispatch>();

	const handleClickNote = (note: {id: string, name: string, text: Text}) => {
		setClickedNId(note.id);
		setEditHeader(note.name);
		setEditText(note.text);
	};

	const handleClickNewNote = () => {
		dispatch(charActions.addNote({id: player.id}));
		reset();
	};

	const reset = () => {
		setEditText(undefined);
		setEditHeader(undefined);
		setClickedNId(undefined);
		if (onChangeChar) onChangeChar();
	};

	const onCancel = () => {
		setEditText(undefined);
		setEditHeader(undefined);
		setClickedNId(undefined);
	};

	const onDelete = () => {
		if (clickedNId) {
			dispatch(charActions.removeNote({id: player.id, noteId: clickedNId}));
			reset();
		} else {
			onCancel();
		}
	};

	const onSaveWithHeader = (text: Text, header: string) => {
		if (clickedNId) { 
			dispatch(charActions.editNote({id: player.id, note: {id: clickedNId, name: header, text}}));
			reset();
		} else {
			onCancel();
		}
	};

	return <div className={styles['scrollable']}>
		<Sticker onClick={handleClickNewNote} key={'note--1'} width={0.25} bodyContent={{type: 'list', children: 
			<div className={styles['new']}>Добавить заметку
				<RoundButton isRed><img className={styles['add-btn']} src='/plus.svg' alt='add'/>
				</RoundButton>
			</div>
		}}/>		
		{player.info.text.notes.map((note) => (
			<Sticker onClick={() => handleClickNote(note)} key={`note-${note.id}`} width={0.25} scrollable hasAddButton header={note.name} stickerCN='big-shadow' bodyContent={note.text} />				
		))}
		{editHeader && <EditTextPopup header={editHeader} onSaveWithHeader={onSaveWithHeader} onCancel={onCancel} onDelete={onDelete} editValue={editText} color='brown'/>}		
	</div>;
}