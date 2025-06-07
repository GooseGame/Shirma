import { useState } from 'react';
import { Sticker } from '../../Sticker/Sticker';
import { TabsProps } from '../Tabs.props';
import { getMeasurementsAsTSX } from './Info.helpers';
import styles from './Info.module.css';
import cn from 'classnames';
import { EditTextPopup } from '../../../EditTextPopup/EditTextPopup';
import { Text } from '../../../../interfaces/Text.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';

export function Info({player, onChangeChar}: TabsProps) {
	const afterHeaderElBackground = <h2 className={cn(styles['background'], styles['redactable'])}>{player.info.backgroundTitle}</h2>;
	const [editHeader, setEditHeader] = useState('');
	const [editText, setEditText] = useState<Text>();
	const [changingProp, setChangingProp] = useState<'background'|'traits'|'ideals'|'affections'|'weaknesses'|'allies'|'features'>();
	const dispatch = useDispatch<AppDispatch>();

	const handleClickBackground = () => {
		setEditText(player.info.text.background);
		setEditHeader(player.info.backgroundTitle);
		setChangingProp('background');
	};
	const handleClickTraits = () => {
		setEditText(player.info.text.traits);
		setEditHeader('Изменить черты');
		setChangingProp('traits');
	};
	const handleClickIdeals = () => {
		setEditText(player.info.text.ideals);
		setEditHeader('Изменить идеалы');
		setChangingProp('ideals');
	};
	const handleClickAffections = () => {
		setEditText(player.info.text.affections);
		setEditHeader('Изменить привязанности');
		setChangingProp('affections');
	};
	const handleClickWeaknesses = () => {
		setEditText(player.info.text.weaknesses);
		setEditHeader('Изменить слабости');
		setChangingProp('weaknesses');
	};
	const handleClickAllies = () => {
		setEditText(player.info.text.allies);
		setEditHeader('Изменить союзников');
		setChangingProp('allies');
	};
	const handleClickFeatures = () => {
		setEditText(player.info.text.features);
		setEditHeader('Изменить владения и языки');
		setChangingProp('features');
	};

	const reset = () => {
		setEditText(undefined);
		setEditHeader('');
		setChangingProp(undefined);
		if (onChangeChar) {
			onChangeChar();
		}
	};

	const onCancel = () => {
		setEditText(undefined);
		setEditHeader('');
		setChangingProp(undefined);
	};

	const onSaveBackground = (text: Text, header: string) => {
		dispatch(charActions.editText({id: player.id, text, property: 'background'}));
		dispatch(charActions.editBGTitle({id: player.id, bgTitle: header}));
		reset();
	};

	const onSave = (text: Text) => {
		if (changingProp) dispatch(charActions.editText({id: player.id, text, property: changingProp}));
		reset();
	};
	
	return <>
		<Sticker width={0.25} header='Предыстория:' fullHeight={true} afterHeaderEl={afterHeaderElBackground} onClick={handleClickBackground} scrollable={true} bodyContent={player.info.text.background} stickerCN='big-shadow'/>
		<Sticker width={0.25} header='Габариты' bodyContent={getMeasurementsAsTSX(player, onChangeChar, dispatch)} scrollable/>
		<Sticker width={0.25} header='Черты характера' bodyContent={player.info.text.traits} onClick={handleClickTraits} scrollable />
		<Sticker width={0.25} header='Идеалы' bodyContent={player.info.text.ideals} onClick={handleClickIdeals} scrollable />
		<Sticker width={0.25} header='Привязанности' bodyContent={player.info.text.affections} onClick={handleClickAffections} scrollable />
		<Sticker width={0.25} header='Слабости' bodyContent={player.info.text.weaknesses} onClick={handleClickWeaknesses} scrollable />
		<Sticker width={0.25} header='Союзники и организации' bodyContent={player.info.text.allies} onClick={handleClickAllies} scrollable />
		<Sticker width={0.25} header='Владения и языки' bodyContent={player.info.text.features} onClick={handleClickFeatures} scrollable hasAddButton eyesRight />
		{editText && 
		<EditTextPopup 
			wrapperCN={styles['edit-text']}
			header={editHeader} 
			onCancel={onCancel} 
			onSave={changingProp !== 'background' ? onSave : undefined} 
			onSaveWithHeader={changingProp === 'background' ? onSaveBackground : undefined} 
			editValue={editText}/>}
	</>;
}