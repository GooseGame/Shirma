import { Sticker } from '../../Sticker/Sticker';
import { TabsProps } from '../Tabs.props';
import cn from 'classnames';
import styles from './Loot.module.css';
import { StickerList } from '../../../StickerList/StickerList';
import { useEffect, useState } from 'react';
import { EditEquipmentElem, EditEquipmentPopup } from './Loot.EditEquipment';
import { EquipmentItem } from '../../../../interfaces/Equipment.interface';
import { EditPossession } from './Loot.EditPossession';

export function Loot({player, onChangeChar}: TabsProps) {
	const PLAYER_WEIGHT_MULT = 15;
	const CRITICAL_WEIGHT_PERCENT = 0.2; //20%
	const [sumWeight, setSumWeight] = useState(0);

	const powerStat = player.stats.find(el=>el.name==='Сила');
	let playerWeightMax = 0;
	if (powerStat) playerWeightMax = powerStat.score * PLAYER_WEIGHT_MULT;

	const isCriticalWeight = (playerWeightMax: number, sumWeight: number) => {
		return (playerWeightMax - sumWeight) < (playerWeightMax * CRITICAL_WEIGHT_PERCENT);
	};

	useEffect(()=>{
		recountSum();
	});
	const recountSum = () => {
		let result = 0;
		player.backpack.equipment.map(el => {
			if (el.weight) {
				result+=el.weight*el.count;
			}
		});
		player.backpack.treasure.map(el => {
			if (el.weight) {
				result+=el.weight*el.count;
			}
		});
		player.backpack.quest.map(el => {
			if (el.weight) {
				result+=el.weight*el.count;
			}
		});
		setSumWeight(result);
	};

	const [eqItem, setEqItem] = useState<EquipmentItem>();
	const [eqClicked, setEqClicked] = useState(false);
	const [actionType, setActionType] = useState<'addEquipmentItem'|'editEquipmentItem'>();
	const [eqType, setEqType] = useState<'equipment'|'treasure'|'quest'>();

	const onClickAddEdit = (item: EquipmentItem, actionType: 'addEquipmentItem'|'editEquipmentItem', type: 'equipment'|'treasure'|'quest') => {
		setEqItem(item);
		setEqClicked(true);
		setActionType(actionType);
		setEqType(type);
	};

	const reset = () => {
		setEqItem(undefined);
		setEqClicked(false);
		setActionType(undefined);
		setEqType(undefined);
	};

	const [possessionClicked, setPossessionClicked] = useState(false);
	const onClickEditPossession = () => {
		setPossessionClicked(true);
	};

	const resetPossessions = () => {
		setPossessionClicked(false);
	};

	return <>
		<Sticker 
			header="Снаряжение" 
			width={0.5} 
			fullHeight 
			stickerStyle='box'
			scrollable 
			bodyContent={{type:'list', children: <EditEquipmentElem player={player} onChangeChar={onChangeChar} onClickAddEdit={onClickAddEdit} type='equipment'/>
			}}/>
		<Sticker
			header='Сокровища'
			width={0.25}
			scrollable
			stickerCN={styles['tall-sticker']}
			stickerStyle='box'
			bodyContent={{
				type: 'list',
				children: <EditEquipmentElem player={player} onChangeChar={onChangeChar} onClickAddEdit={onClickAddEdit} type='treasure'/>
			}}/>
		<Sticker
			header='Квестовое'
			width={0.25}
			scrollable
			stickerCN={styles['tall-sticker']}
			stickerStyle='box'
			bodyContent={{
				type: 'list',
				children: <EditEquipmentElem player={player} onChangeChar={onChangeChar} onClickAddEdit={onClickAddEdit} type='quest'/>
			}}/>
		<Sticker
			header='Владение'
			width={0.25}
			scrollable
			hasAddButton
			onClickAddButton={onClickEditPossession}
			stickerCN='big-shadow'
			bodyContent={{
				type: 'list',
				children: <>
					{player.info.text.possession.map(item => (
						<StickerList key={item.category} header={item.category} desc={{ type:'word', children: item.items}}/>
					))}
				</>
			}}/>
		<div className={styles['weight-wrap']}>
			<img className={styles['weight-img']} src='/weight-dark.svg'/>
			<div className={styles['weight-info']}>
				<span className={styles['weight']}>
						Общий вес:
				</span>
				<span className={cn(styles['weight-used'], isCriticalWeight(playerWeightMax, sumWeight) ? styles['red'] : styles['green'])}>
					{sumWeight}
				</span>
				<span className={styles['weight']}>
					/{playerWeightMax}
				</span>
			</div>
		</div>
		{(eqClicked && eqItem && actionType && eqType) && 
			<EditEquipmentPopup 
				player={player} 
				onChangeChar={onChangeChar} 
				type={eqType} 
				equipment={eqItem} 
				action={actionType} 
				reset={reset} 
			/>}
		{possessionClicked && 
			<EditPossession
				player={player}
				onChangeChar={onChangeChar}
				reset={resetPossessions}
			/>
		}
	</>;
}