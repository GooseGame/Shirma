import { useState } from 'react';
import { handleAimClick, handleDamageClick } from '../../../../helpers/attributes';
import { Sticker } from '../../Sticker/Sticker';
import { WeaponItem } from '../../WeaponItem/WeaponItem';
import { TabsProps } from '../Tabs.props';
import styles from './Attacks.module.css';
import { Weapon } from '../../../../interfaces/Equipment.interface';
import { WeaponPopup } from './Attack.weaponPopup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import { RoundButton } from '../../../Button/Button';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';
import cn from 'classnames';

export function Attacks({player, setDiceRoll, onChangeChar}: TabsProps) {	
	const melee = player.backpack.weapons.filter(el => el.isMelee);
	const distance = player.backpack.weapons.filter(el => !el.isMelee);
	const [wClicked, setWCLicked] = useState(false);
	const [editWeapon, setEditWeapon] = useState<Weapon>();
	const [isShowProfPopup, setIsShowProfPopup] = useState(false);
	const [savedProf, setSavedProf] = useState(player.proficiency);
	const dispatch = useDispatch<AppDispatch>();
	

	const onClickEdit = (item: Weapon) => {
		setWCLicked(true);
		setEditWeapon(item);
	};
	const onClickAdd = () => {
		setWCLicked(true);
	};
	const onReset = () => {
		setEditWeapon(undefined);
		setWCLicked(false);
	};

	const onCancelProfPopup = () => {
		setIsShowProfPopup(false);
		setSavedProf(player.proficiency);
	};

	const onSaveProf = () => {
		if (savedProf < 0 || savedProf >= 99) return;
		dispatch(charActions.changeProf({ id: player.id, value: savedProf }));
		if (onChangeChar) onChangeChar(`Владение: ${player.proficiency} - ${savedProf}`, 'Изменены характеристики');
		setIsShowProfPopup(false);
	};

	const onClickDelete = (item: Weapon) => {
		dispatch(charActions.deleteWeapon({id: player.id, value: item.id}));
		if (onChangeChar) onChangeChar(item.name,'Удалено оружие');
	};

	return <>
		
		{isShowProfPopup && <EditCustomPopup
			wrapperCN={styles['prof-popup']}
			onCancel={onCancelProfPopup}
			color='blue'
			header='Бонус владения'
		>
			<div className={styles['prof-popup-content']}>
				<label htmlFor='prof-input' className={styles['prof-popup-label']}>Значение</label>
				<input
					id='prof-input'
					type='number'
					className={styles['prof-popup-input']}
					value={savedProf}
					onChange={(e)=>e.target.value !== '' ? setSavedProf(parseInt(e.target.value)) : setSavedProf(0)}
				/>
				<div className={styles['save-btn']} onClick={onSaveProf}>
					<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
				</div>
			</div>
		</EditCustomPopup>}
		<Sticker
			 afterHeaderEl={<RoundButton
			classNames={cn(styles['prof-btn'], styles['big-shadow'])}
			onClick={()=>setIsShowProfPopup(true)}
		>
			<div className={styles['prof-btn-content']}>
				<span className={styles['prof-value']}>+{player.proficiency}</span>
				<span className={styles['prof-label']}>Владение</span>
			</div>
		</RoundButton>}
			width={0.5} stickerStyle='metal' fullHeight scrollable header='Ближний бой' bodyContent={
			{
				type: 'list',
				children: <div className={styles['content']}>
					{melee.map((item, index) => {
						const weaponStat = player.stats.find(stat => stat.name === item.scaleStat);
						const aimMod = item.aimModifier + (weaponStat ? weaponStat.modifier : 0) + (item.isProf ? player.proficiency : 0);
						return <WeaponItem 
							onClickDelete={()=>onClickDelete(item)}
							onClickName={()=>onClickEdit(item)} 
							setAimRoll={() => setDiceRoll ? handleAimClick(item.aimModifier, setDiceRoll) : ''} 
							setDmgRoll={() => setDiceRoll ? handleDamageClick(item.damage, setDiceRoll) : ''} 
							key={`melee-${item.name}-${index}`} 
							weapon={item} 
							aimMod={aimMod}/>;
					})}
					<div className={styles['add-new']} onClick={onClickAdd}>
						<span className={styles['add-new-text']}>Добавить</span>
					</div>
				</div>
			}
		}/>
		<Sticker width={0.5} stickerStyle='metal' fullHeight scrollable header='Дальний бой' bodyContent={
			{
				type: 'list',
				children: <div className={styles['content']}>
					{distance.map((item, index) => {
						const weaponStat = player.stats.find(stat => stat.name === item.scaleStat);
						const aimMod = item.aimModifier + (weaponStat ? weaponStat.modifier : 0) + (item.isProf ? player.proficiency : 0);
						return <WeaponItem 
							onClickDelete={()=>onClickDelete(item)}
							onClickName={()=>onClickEdit(item)} 
							setAimRoll={() => setDiceRoll ? handleAimClick(item.aimModifier, setDiceRoll) : ''} 
							setDmgRoll={() => setDiceRoll ? handleDamageClick(item.damage, setDiceRoll) : ''} 
							key={`dist-${item.name}-${index}`} 
							aimMod={aimMod} 
							weapon={item}/>;
					})}
					<div className={styles['add-new']} onClick={onClickAdd}>
						<span className={styles['add-new-text']}>Добавить</span>
					</div>
				</div>
			}
		}/>
		{(wClicked && onChangeChar) && 
			<WeaponPopup 
				onChangeChar={onChangeChar} 
				player={player} 
				reset={onReset} 
				editWeapon={editWeapon}
			/>
		}
	</>;
}