import { useState } from 'react';
import { Character } from '../../../../interfaces/Character.interface';
import { DistanceExtended, Weapon, WeaponAttribute } from '../../../../interfaces/Equipment.interface';
import { randomHash } from '../../../../helpers/random';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';
import styles from './Attacks.module.css';
import weapons, { WeaponPreset } from '../../../../helpers/weapons';
import { ATTRIBUTE_DISTANCE, attributes, DAMAGE_TYPE_BLUDGEONING, damages, distanceExtendedPreset, getAttributeById, getDamageById } from '../../../../helpers/attributes';
import { Eye } from '../../../Eye/Eye';
import { WeaponAttributes } from '../../WeaponAttributes/WeaponAttributes';
import cn from 'classnames';

interface WeaponPopupProps {
	onChangeChar: () => void, 
	player: Character,
	reset: ()=>void,
	editWeapon?: Weapon
}

export function WeaponPopup({onChangeChar, player, reset, editWeapon}: WeaponPopupProps) {
	const [savedWName, setSavedWName] = useState(editWeapon?.name);
	const [savedWIsMelee, setSavedWIsMelee] = useState(editWeapon ? editWeapon.isMelee : false);
	const [savedWScaleStat, setSavedWScaleStat] = useState(editWeapon?.scaleStat);
	const [savedWIsProf, setSavedWIsProf] = useState(editWeapon ? editWeapon.isProf : false);
	const [savedWAimMod, setSavedWAimMod] = useState(editWeapon ? editWeapon.aimModifier : 0);
	const [savedWWeight, setSavedWWeight] = useState(editWeapon ? editWeapon.weight : 0);
	const [savedWDmg, setSavedWDmg] = useState(editWeapon?.damage);
	const [savedWAttr, setSavedWAttr] = useState(editWeapon?.attributes);
	const [switchToPresets, setSwitchToPresets] = useState(false);

	const dispatch = useDispatch<AppDispatch>();

	const isValid = () => {
		if (!savedWName || savedWName === '') return false;
		if (!savedWScaleStat || savedWScaleStat === '') return false;
		if (savedWIsMelee === undefined || savedWIsProf === undefined) return false;
		return true;
	};

	const onSave = () => {
		if (!isValid) return;

		const weaponObj: Weapon = {
			id: editWeapon ? editWeapon.id : randomHash(),
			name: savedWName ? savedWName : '',
			isProf: savedWIsProf,
			isMelee: savedWIsMelee,
			aimModifier: savedWAimMod ? savedWAimMod : 0,
			scaleStat: savedWScaleStat ? savedWScaleStat : 'Сила',
			weight: savedWWeight,
			damage: savedWDmg ? savedWDmg : [],
			attributes: savedWAttr ? savedWAttr : [],
			count: 1
		};
		if (editWeapon) {
			dispatch(charActions.editWeapon({id: player.id, value: weaponObj}));
		} else {
			dispatch(charActions.addWeapon({id: player.id, value: weaponObj}));
		}
		if (onChangeChar) onChangeChar();
		reset();
	};

	const addRemoveAttr = (attr: WeaponAttribute) => {
		if (!savedWAttr) {
			setSavedWAttr([attr]);
			return;
		}
		const attrIsSaved = savedWAttr.find(sAttr => sAttr.id === attr.id);
		if (attrIsSaved) {
			setSavedWAttr(savedWAttr.filter(sAttr => sAttr.id !== attr.id));
		} else {
			setSavedWAttr([...savedWAttr, attr]);
		}
	};

	const addDmg = () => {
		if (savedWDmg) {
			setSavedWDmg([...savedWDmg, {modifiers: 0, value: {count: 1, edge: 4}, typeId: DAMAGE_TYPE_BLUDGEONING, dmg_id: randomHash()}]);
		} else {
			setSavedWDmg([{modifiers: 0, value: {count: 1, edge: 4}, typeId: DAMAGE_TYPE_BLUDGEONING, dmg_id: randomHash()}]);
		}
	};

	const removeDmg = (id: string) => {
		if (savedWDmg) {
			setSavedWDmg(savedWDmg.filter(dmg => dmg.dmg_id !== id));
		}
	};

	const onChangeDmgDiceCount = (id: string, value: number) => {
		if (savedWDmg) {
			setSavedWDmg(savedWDmg.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, value: {...dmg.value, count: value}};
			}));
		}
	};

	const onChangeDmgDiceEdge = (id: string, value: number) => {
		if (savedWDmg) {
			setSavedWDmg(savedWDmg.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, value: {...dmg.value, edge: value}};
			}));
		}
	};

	const onChangeDmgDiceMod = (id: string, value: number) => {
		if (savedWDmg) {
			setSavedWDmg(savedWDmg.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, modifiers: value};
			}));
		}
	};

	const onChangeDmgType = (id: string, value: number) => {
		if (savedWDmg) {
			setSavedWDmg(savedWDmg.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, typeId: value};
			}));
		}
	};

	const onCancel = () => {
		setSavedWName(editWeapon?.name);
		setSavedWIsMelee(editWeapon ? editWeapon.isMelee : false);
		setSavedWScaleStat(editWeapon?.scaleStat);
		setSavedWIsProf(editWeapon ? editWeapon.isProf : false);
		setSavedWAimMod(editWeapon ? editWeapon.aimModifier : 0);
		setSavedWWeight(editWeapon ? editWeapon.weight : 0);
		setSavedWDmg(editWeapon?.damage);
		setSavedWAttr(editWeapon?.attributes);
		setSwitchToPresets(false);
		reset();
	};

	const onClickPreset = (preset: WeaponPreset) => {
		console.log(preset);
		setSavedWName(preset.name);
		setSavedWScaleStat(preset.scaleStat);
		setSavedWWeight(preset.weight);
		setSavedWAttr(preset.attributes);
		setSavedWDmg(preset.damage);
		setSavedWIsMelee(preset.isMelee);
		setSwitchToPresets(false);
	};

	const getDmgTypeStyles = (dmgTypeId: number) => {
		const foundDmgType = damages.find(dmg => dmg.id === dmgTypeId);
		return foundDmgType ? {backgroundColor: foundDmgType.bgColor, color: foundDmgType.color} : {backgroundColor: '#1E1E1E', color: '#D9D9D9'};
	};

	return <EditCustomPopup 
		header={editWeapon ? `Изменить ${editWeapon.name}` : 'Добавить оружие'}
		onCancel={onCancel}
		wrapperCN={styles['edit-weapon-wrapper']}
		color='blue'
		scrollable
	>
		<button className={styles['show-presets-btn']} onClick={()=>setSwitchToPresets(!switchToPresets)}>
			{switchToPresets ? 'Скрыть пресеты' : 'Выбрать из пресетов'}
			<img src={switchToPresets ? '/x-red.svg' : '/more.svg'} className={styles['open-close-img']}/>
		</button>
		{switchToPresets && 
		<div className={styles['presets-opened']}>
			{weapons.map(weapon => {
				const containsDistance = weapon.attributes.find(attr => attr.id === ATTRIBUTE_DISTANCE);
				const distanceExtended = containsDistance ? 
				{...containsDistance, ...distanceExtendedPreset} as DistanceExtended :
					undefined;
				return <div key={weapon.id} onClick={()=>onClickPreset(weapon)} className={styles['preset-wrapper']}>
					<div className={styles['top-preset']}>
						<span className={styles['preset-name']}>{weapon.name}</span>
						{weapon.description && <Eye text={weapon.description} offsetHint={20} white/>}
					</div>
					<div className={styles['preset-line']}>
						<span className={styles['preset-label']}>Урон:</span>
						<div className={styles['right-preset']}>
							{weapon.damage.map((dmg, index) => {
								const dmgTypeExtended = getDamageById(dmg.typeId);
								if (dmgTypeExtended) return <Eye key={`${weapon.name}-${dmg.typeId}-${index}`} offsetHint={40} text={dmgTypeExtended.desc} ElementIstead={
									<WeaponAttributes size='small' info={
										{
											...dmg,
											...dmgTypeExtended
										}
									}/>
								}/>;
							})}
						</div>
					</div>
					<div className={styles['preset-line']}>
						<span className={styles['preset-label']}>Атрибуты:</span>
						<div className={styles['right-preset']}>
							{weapon.attributes.map((attr, index) => {
								if (attr.id !== ATTRIBUTE_DISTANCE) {
									const attrExtended = getAttributeById(attr.id);
									if (attrExtended) return <Eye key={`${attr.id}-${index}`}  offsetHint={35} text={attrExtended.desc} ElementIstead={
										<WeaponAttributes size='small' info={attrExtended}/>
									}/>;
								}
							})}
						</div>
					</div>
					<div className={styles['bottom-presets']}>
						<div className={styles['preset-tag']}>
							{weapon.isMelee ? 'Ближний бой' : 'Дальний бой'}
						</div>
						{(!weapon.isMelee && distanceExtended) && 
							<Eye 
								key={`distance-${distanceExtended.distance}-${distanceExtended.maxDistance}`} 
								offsetHint={40} 
								text={distanceExtended.desc} 
								ElementIstead={
									<WeaponAttributes size='small' info={distanceExtended}/>
								}
							/>
						}
						{weapon.weight && <div title='вес' className={styles['preset-tag']}>
							<img src='/weight.svg' alt='weight' className={styles['weight-icon']}/>
							{weapon.weight} фнт
						</div>}
					</div>
				</div>;
			})}
		</div>
		}
		{!switchToPresets && <div className={styles['weapon-content']}>
			<input 
				type='text' 
				className={cn(styles['weapon-input'], styles['big-input'])} 
				value={savedWName} 
				placeholder='Название' 
				onChange={(e)=>setSavedWName(e.target.value)}/>

			<div className={styles['weapon-info-line']}>
				<div className={styles['weapon-list']}>
					<input 
						list='stats' 
						className={styles['list-stats-input']} 
						value={savedWScaleStat} 
						onChange={(e)=>setSavedWScaleStat(e.target.value)} 
						placeholder='Какая характеристика?'/>
					<datalist id='stats'>
						{player.stats.map(stat=>(<option key={stat.name} value={stat.name}></option>))}
					</datalist>
				</div>
				<div className={styles['weapon-info-right']}>
					<div className={styles['input-wrapper']}>
						<input 
							type='checkbox' 
							className={styles['weapon-checkbox']} 
							checked={savedWIsProf} 
							id='is-prof' 
							onChange={()=>setSavedWIsProf(!savedWIsProf)}/>
						<label htmlFor='is-prof' className={styles['weapon-label']}>Умею пользоваться?</label>
					</div>
					<div className={cn(styles['input-wrapper'], styles['background-wrapper'])}>
						<label htmlFor='aim-mod' className={styles['weapon-label']}>Бонус к попаданию</label>
						<input 
							id='aim-mod'
							type='number' 
							className={cn(styles['weapon-input'], styles['number-input'])} 
							value={savedWAimMod} 
							placeholder='Бонус к попаданию' 
							onChange={(e)=>setSavedWAimMod(e.target.value === '' ? 0 : parseInt(e.target.value))}/>
					</div>
				</div>
			</div>
			<div className={styles['weapon-info-line']}>
				<div className={styles['input-wrapper']}>
					<input 
						type='checkbox' 
						className={styles['weapon-checkbox']} 
						checked={savedWIsMelee} 
						id='is-melee' 
						onChange={()=>setSavedWIsMelee(!savedWIsMelee)}/>
					<label htmlFor='is-melee' className={styles['weapon-label']}>Ближний бой?</label>
				</div>
				<div className={cn(styles['input-wrapper'], styles['background-wrapper'])}>
					<label htmlFor='weight' className={styles['weapon-label']}>Вес</label>
					<input 
						id='weight'
						type='number' 
						className={cn(styles['weapon-input'], styles['number-input'])} 
						value={savedWWeight} 
						placeholder='Вес (можно не указывать)' 
						onChange={(e)=>setSavedWWeight(e.target.value === '' ? 0 : parseInt(e.target.value))}/>
				</div>
			</div>
			<div className={styles['attrs-wrapper']}>
				<span className={styles['preset-name']}>Атрибуты оружия</span>
				<div className={styles['weapon-attrs']}>
					{attributes.map(attr => (
						<Eye 
							key={attr.id}
							offsetHint={45} 
							text={attr.desc} 
							ElementIstead={
								<div key={attr.id} className={styles['attr-checkbox']} onClick={()=>addRemoveAttr(attr)}>
									<WeaponAttributes info={attr}/>
									{(savedWAttr && savedWAttr.find(sAttr => sAttr.id === attr.id)) && 
										<div className={styles['checked-wrapper']}>
											<img src='/more-white.svg' alt='checked' className={styles['checked-attr']}/>
										</div>
									}
								</div>
							}/>
					))}
				</div>
			</div>
			<div className={styles['damages-wrapper']}>
				<span className={styles['preset-name']}>Урон</span>
				{savedWDmg && savedWDmg.map(dmg => (
					<div className={styles['damage']} key={dmg.dmg_id}>
						<div className={styles['damage-value']}>
							<input 
								type='number' 
								className={styles['dice-count']} 
								value={dmg.value.count} 
								onChange={(e)=> e.target.value === '' ? 
									onChangeDmgDiceCount(dmg.dmg_id, 0) : 
									onChangeDmgDiceCount(dmg.dmg_id, parseInt(e.target.value))}/>
							<span className={styles['dice-k']}>К</span>
							<select 
								name='dice' 
								className={styles['dice-value']}
								value={dmg.value.edge} 
								onChange={(e)=> e.target.value === '' ? 
									onChangeDmgDiceEdge(dmg.dmg_id, 0) :
									onChangeDmgDiceEdge(dmg.dmg_id, parseInt(e.target.value))}
							>
								<option value={2}>2</option>
								<option value={4}>4</option>
								<option value={6}>6</option>
								<option value={8}>8</option>
								<option value={10}>10</option>
								<option value={12}>12</option>
								<option value={20}>20</option>
							</select>
						</div>
						<div className={cn(styles['input-wrapper'], styles['background-wrapper'])}>
							<label htmlFor='dmg-mod' className={styles['weapon-label']}>Модификатор</label>
							<input 
								id='dmg-mod'
								type='number' 
								value={dmg.modifiers} 
								className={cn(styles['weapon-input'], styles['number-input'])}
								onChange={(e)=> e.target.value === '' ? 
									onChangeDmgDiceMod(dmg.dmg_id, 0) :
									onChangeDmgDiceMod(dmg.dmg_id, parseInt(e.target.value))}
							/>
						</div>
						<select 
							className={styles['dmg-type']}
							name='damageType' 
							value={dmg.typeId} 
							style={getDmgTypeStyles(dmg.typeId)}
							onChange={(e)=> e.target.value === '' ? 
								onChangeDmgType(dmg.dmg_id, DAMAGE_TYPE_BLUDGEONING) :
								onChangeDmgType(dmg.dmg_id, parseInt(e.target.value))}>
							{damages.map(dmgType => (
								<option key={dmgType.id} value={dmgType.id}>{dmgType.name}</option>
							))}
						</select>
						<button className={styles['remove-dmg']} onClick={()=>removeDmg(dmg.dmg_id)}>
							<img src='/x.svg' alt='remove damage' className={styles['remove-icon']}/>
						</button>
					</div>
				))}
				<button className={styles['add-dmg']} onClick={addDmg}>
					<img src='/plus.svg' alt='add weapon' className={styles['add-btn']}/>
				</button>
			</div>
			{isValid() && <div className={cn(styles['save-btn'])} onClick={onSave}>
				<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
			</div>}
		</div>}
	</EditCustomPopup>;
}