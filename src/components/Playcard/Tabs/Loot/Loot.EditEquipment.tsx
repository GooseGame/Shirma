import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { EquipmentItem } from '../../../../interfaces/Equipment.interface';
import { charActions } from '../../../../store/slices/Characters.slice';
import { Character } from '../../../../interfaces/Character.interface';
import styles from './Loot.module.css';
import { RoundButton } from '../../../Button/Button';
import cn from 'classnames';
import { useState } from 'react';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';
import { Equipment } from '../../Equipment/Equipment';

interface EditEquipmentElemProps {
	player: Character,
	onChangeChar: (()=>void) | undefined,
	type: 'equipment'|'treasure'|'quest',
	onClickAddEdit: (
		item: EquipmentItem, 
		actionType: 'addEquipmentItem'|'editEquipmentItem', 
		type: 'equipment'|'treasure'|'quest'
	) => void
}

export function EditEquipmentElem({player, onChangeChar, type, onClickAddEdit}:EditEquipmentElemProps) {
	const dispatch = useDispatch<AppDispatch>();
	const handleClickLess = (el: EquipmentItem, type: 'equipment'|'treasure'|'quest') => {
		dispatch(charActions.decEquipmentItem({id: player.id, name: el.name, type}));
		if (onChangeChar) onChangeChar();
	};

	const handleClickMore = (el: EquipmentItem, type: 'equipment'|'treasure'|'quest') => {
		dispatch(charActions.incEquipmentItem({id: player.id, name: el.name, type}));
		if (onChangeChar) onChangeChar();
	};

	const handleClickDelete = (el: EquipmentItem, type: 'equipment'|'treasure'|'quest') => {
		dispatch(charActions.deleteEquipmentItem({id: player.id, name: el.name, type}));
		if (onChangeChar) onChangeChar();
	};

	const newElem: EquipmentItem = {
		name: '',
		count: 1
	};

	return <>
		{player.backpack[type].map(el => (
			<Equipment 
				classNames={styles['light']} 
				size= {type !== 'equipment' ? 'small' : 'medium'}
				key={el.name} 
				item={el} 
				onClickDelete={()=>handleClickDelete(el, type)} 
				onClickLess={()=>handleClickLess(el, type)} 
				onClickMore={() => handleClickMore(el, type)}
				onClickText={()=>onClickAddEdit(el, 'editEquipmentItem', type)}
			/>
		))}
		<div className={styles['bottom']}>
			<RoundButton classNames={cn(styles['full-size-icon'], 'small-shadow')} onClick={()=>onClickAddEdit(newElem, 'addEquipmentItem', type)}>
				<img src='/plus.svg' className={styles['big-plus']} />
			</RoundButton>
		</div>
	</>;
}

interface EditEquipmentPopupProps {
	player: Character,
	onChangeChar: (()=>void) | undefined,
	type: 'equipment'|'treasure'|'quest',
	equipment: EquipmentItem,
	action: 'addEquipmentItem'|'editEquipmentItem',
	reset: ()=>void
}
export function EditEquipmentPopup({player, onChangeChar, type, equipment, action, reset}: EditEquipmentPopupProps) {
	const [savedEqName, setSavedEqName] = useState(equipment.name);
	const [savedEqCount, setSavedEqCount] = useState(equipment.count);
	const [savedEqDesc, setSavedEqDesc] = useState(equipment.description);
	const [savedEqWeight, setSavedEqWeight] = useState(equipment.weight);
	const dispatch = useDispatch<AppDispatch>();

	const onSave = () => {
		if (savedEqCount <= 0) return;
		dispatch(charActions[action]({
			id: player.id,
			value: {
				name: savedEqName === '' ? equipment.name : savedEqName,
				count: (savedEqCount > 9999) ? 9999 : savedEqCount,
				description: savedEqDesc,
				weight: (savedEqWeight && savedEqWeight > 999) ? 999 : savedEqWeight
			},
			oldName: equipment.name,
			type
		}));
		if (onChangeChar) onChangeChar();
		reset();
	};
	
	const onCancel = () => {
		setSavedEqName(equipment.name);
		setSavedEqCount(equipment.count);
		setSavedEqDesc(equipment.description);
		setSavedEqWeight(equipment.weight);
		reset();
	};

	const getHeader = () => {
		let result = action === 'addEquipmentItem' ? 'Добавить ' : 'Изменить ';
		switch (type) {
		case 'equipment':
			result += 'снаряжение';
			break;
		case 'quest':
			result += 'квестовый предмет';
			break;
		case 'treasure':
			result += 'сокровище';
			break;
		default:
			break;
		}
		return result;
	};

	const isValid = () => {
		return savedEqName !== '' && savedEqCount > 0;
	};
	
	return <EditCustomPopup onCancel={onCancel} header={getHeader()} color='darker-brown' wrapperCN={styles['edit-eq-wrapper']}>
		<>
			<div className={styles['eq-inputs']}>
				<div className={styles['eq-inputs-line']}>
					<label htmlFor='eq-name' className={styles['eq-inputs-label']}>
						Название
					</label>
					<input 
						type='text' 
						className={styles['eq-inputs-input']} 
						placeholder='Название' 
						value={savedEqName} 
						name='eq-name' 
						onChange={(e)=>setSavedEqName(e.target.value)}/>
				</div>
				<div className={styles['eq-inputs-rows']}>
					<div className={styles['row']}>
						<label htmlFor='eq-weight' className={styles['eq-inputs-label']}>
							Вес (необязательно)
						</label>
						<input 
							type='number' 
							className={styles['eq-inputs-input']} 
							placeholder='Вес' 
							value={savedEqWeight ? savedEqWeight : 0} 
							name='eq-weight' 
							onChange={(e)=>setSavedEqWeight(e.target.value === '0' ? undefined : parseInt(e.target.value))}/>
					</div>
					<div className={styles['row']}>
						<label htmlFor='eq-count' className={styles['eq-inputs-label']}>
							Количество
						</label>
						<input 
							type='number' 
							className={styles['eq-inputs-input']} 
							placeholder='Количество' 
							value={savedEqCount} 
							name='eq-weight' 
							onChange={(e)=>setSavedEqCount(parseInt(e.target.value))}/>
					</div>
				</div>
				<div className={styles['eq-inputs-line']}>
					<span className={styles['eq-inputs-label']}>
						Описание (необязательно)
					</span>
					<textarea
						className={styles['textarea']}
						onChange={(e)=>setSavedEqDesc(e.target.value === '' ? undefined : e.target.value)}
						placeholder='Описание'
						value={savedEqDesc}
					></textarea>
				</div>
			</div>
			<div className={cn(styles['save-btn'], isValid() ? '' : styles['invisible'])} onClick={onSave}>
				<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
			</div>
		</>
	</EditCustomPopup>;
}