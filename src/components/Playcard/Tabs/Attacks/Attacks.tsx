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

export function Attacks({player, setDiceRoll, onChangeChar}: TabsProps) {	
	const melee = player.backpack.weapons.filter(el => el.isMelee);
	const distance = player.backpack.weapons.filter(el => !el.isMelee);
	const [wClicked, setWCLicked] = useState(false);
	const [editWeapon, setEditWeapon] = useState<Weapon>();
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

	const onClickDelete = (item: Weapon) => {
		dispatch(charActions.deleteWeapon({id: player.id, value: item.id}));
		if (onChangeChar) onChangeChar(item.name,'Удалено оружие');
	};

	return <>
		<Sticker width={0.5} stickerStyle='metal' fullHeight scrollable header='Ближний бой' bodyContent={
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