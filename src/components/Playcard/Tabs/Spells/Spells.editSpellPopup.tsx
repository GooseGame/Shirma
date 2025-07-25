import { HTMLAttributes, useState } from 'react';
import { Character, CharacterClass } from '../../../../interfaces/Character.interface';
import { Spell, SpellComponet } from '../../../../interfaces/spells.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { EditTextPopup } from '../../../EditTextPopup/EditTextPopup';
import { randomHash } from '../../../../helpers/random';
import { charActions } from '../../../../store/slices/Characters.slice';
import { Text } from '../../../../interfaces/Text.interface';
import styles from './Spells.module.css';
import { TextInput } from '../../../TextInput/TextInput';
import { NumberInput } from '../../../NumberInput/NumberInput';
import cn from 'classnames';
import { cellsColorObj, materialComponentDescription, materialComponentTemplate, somaticComponentDescription, somaticComponentTemplate, verbalComponentDescription, verbalComponentTemplate } from '../../../../helpers/createSpell';
import { Eye } from '../../../Eye/Eye';
import attackStyles from '../Attacks/Attacks.module.css';
import { DAMAGE_TYPE_BLUDGEONING, damages } from '../../../../helpers/attributes';
import { Damage } from '../../../../interfaces/Equipment.interface';
import { DamageRegex } from '../../../DamageRegex/DamageRegex';
import { MAX_DAMAGES_PER_ITEM } from '../../../../helpers/weapons';

export interface EditSpellPopupProps extends HTMLAttributes<HTMLDivElement> {
	character: Character, 
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
	spell?: Spell, 
	chosenLevel?: number,
	onChangeChar?: ((popupText?: string, popupHeader?: string) => void)
}

export function EditSpellPopup({character, setIsOpen, spell, chosenLevel, onChangeChar}: EditSpellPopupProps) {
	const dispatch = useDispatch<AppDispatch>();

	const [name, setName] = useState(spell?.name);
	const [distance, setDistance] = useState(spell ? spell.distance : 'Обычно в футах');
	const [duration, setDuration] = useState(spell ? spell.duration : '(действие, час или больше)');
	const [castTime, setCastTime] = useState(spell ? spell.castTime : '(действие или больше)');
	const [description, setDescription] = useState(spell?.description);
	const [components, setComponents] = useState(spell ? spell.components : []);
	const [availibleFor, setAvailibleFor] = useState(spell ? spell.availibleFor : []);
	const [level, setLevel] = useState(spell ? spell.level : chosenLevel ? chosenLevel : 0);
	const [concentration, setConcentration] = useState(spell?.concentration);
	const [aim, setAim] = useState(spell?.aim);
	const [damageRoll, setDamageRoll] = useState(spell?.damageRoll);
	const [addDamageClicked, setAddDamageClicked] = useState(false);
	const id = spell ? spell.id : randomHash();

	const onCancelPopup = () => {
		setName(undefined);
		setDistance('Выбери дистанцию');
		setDuration('Выбери длительность');
		setCastTime('Выбери время каста');
		setDescription(undefined);
		setComponents([]);
		setAvailibleFor([]);
		setLevel(0);
		setConcentration(false);
		setAim(false);
		setDamageRoll(undefined);
		setAddDamageClicked(false);
		setIsOpen(false);
	};

	const isComponentInList = (shortLetter: string) => {
		return components.find((c) => c.shortLetter === shortLetter) !== undefined;
	};

	const isClassInList = (classTitle: string) => {
		return availibleFor.find((av) => av.name === classTitle) !== undefined;
	};

	const onDelete = () => {
		if (spell) {
			dispatch(charActions.deleteSpell({id: character.id, value: id}));
			setIsOpen(false);
			if (onChangeChar) onChangeChar(spell.name,'Удалено заклинание:');
		}
	};

	const isDistanceValid = ()=>{return distance ? distance.length < 99 : false;};
	const isDurationValid = ()=>{return duration ? duration.length < 99 : false;};
	const isCastTimeValid = ()=>{return castTime ? castTime.length < 99 : false;};
	const isLevelValid = ()=>{return level ? (level >= 0 && level < 9) : false;};


	const onSave = (text: Text, header: string) => {
		const spellObj = {
			id,
			distance: isDistanceValid() ? distance : '',
			duration: isDurationValid() ? duration : '',
			castTime: isCastTimeValid() ? castTime : '',
			description: text,
			name: header,
			components: components ? components : [],
			availibleFor: availibleFor ? availibleFor : [],
			aim: aim ? aim : false,
			level: isLevelValid() ? level : 0,
			concentration: concentration ? concentration : false,
			damageRoll
		} as Spell;
		if (spell) {
			dispatch(charActions.editSpell({id: character.id, value: spellObj}));
		} else {
			dispatch(charActions.addSpell({id: character.id, value: spellObj}));
		}
		setIsOpen(false);
		if (onChangeChar) onChangeChar(spell ? spell.name : spellObj.name, spell ? 'Изменено заклинание:' : 'Добавлено заклинание:');
	};

	const getDmgPreset = () => { 
		return {
			modifiers: 0, 
			value: {count: 1, edge: 4}, 
			typeId: DAMAGE_TYPE_BLUDGEONING, 
			dmg_id: randomHash()
		};
	};

	const addDmg = () => {
		if (damageRoll) {
			setDamageRoll([...damageRoll, getDmgPreset()]);
		} else {
			setDamageRoll([getDmgPreset()]);
		}
	};
	
	const removeDmg = (id: string) => {
		if (damageRoll) {
			setDamageRoll(damageRoll.filter(dmg => dmg.dmg_id !== id));
		}
	};

	const onChangeDmgDiceCount = (id: string, value: number) => {
		if (damageRoll) {
			setDamageRoll(damageRoll.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, value: {...dmg.value, count: value}};
			}));
		}
	};

	const onChangeDmgDiceEdge = (id: string, value: number) => {
		if (damageRoll) {
			setDamageRoll(damageRoll.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, value: {...dmg.value, edge: value}};
			}));
		}
	};

	const onSaveDamageParser = (dmg: Damage|null, inputDmgId?: string) => {
		//если добавили новый урон
		if (!inputDmgId && dmg !== null) {
			console.log('new');
			if (damageRoll) {
				setDamageRoll([...damageRoll, dmg]);
			} else {
				setDamageRoll([dmg]);
			}
			console.log(damageRoll);
			setAddDamageClicked(false);
			return;
		}
		//если редактируем существующий
		if (inputDmgId && damageRoll) {
			console.log('edit');
			//удаляем
			if (dmg === null) {
				console.log('delete');
				removeDmg(inputDmgId);
			} else {
				console.log('edit2');
				setDamageRoll(damageRoll.map(el => {
					if (el.dmg_id !== dmg.dmg_id) return el;
					return dmg;
				}));
				console.log(damageRoll);
			}
		}
		setAddDamageClicked(false);
	};

	const onChangeDmgDiceMod = (id: string, value: number) => {
		if (damageRoll) {
			setDamageRoll(damageRoll.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, modifiers: value};
			}));
		}
	};

	const getDmgTypeStyles = (dmgTypeId: number) => {
		const foundDmgType = damages.find(dmg => dmg.id === dmgTypeId);
		return foundDmgType ? {backgroundColor: foundDmgType.bgColor, color: foundDmgType.color} : {backgroundColor: '#1E1E1E', color: '#D9D9D9'};
	};

	const onChangeDmgType = (id: string, value: number) => {
		if (damageRoll) {
			setDamageRoll(damageRoll.map(dmg => {
				if (dmg.dmg_id !== id) return dmg;
				return {...dmg, typeId: value};
			}));
		}
	};

	const onClickComponent = (component: SpellComponet) => {
		const isInList = isComponentInList(component.shortLetter);
		if (!isInList) {
			setComponents([...components, component]);
		} else {
			setComponents(components.filter(c => c.shortLetter !== component.shortLetter));
		}
	};

	const onClickClasslist = (classAvailible: CharacterClass) => {
		const isInList = isClassInList(classAvailible.name);
		if (!isInList) {
			setAvailibleFor([...availibleFor, classAvailible]);
		} else {
			setAvailibleFor(availibleFor.filter(c => c.name !== classAvailible.name));
		}
	};

	return <EditTextPopup
		wrapperCN={styles['edit-spell-popup-wrapper']}
		editValue={description ? description : {type: 'text', text: []}}
		header={name?name:'Новое крутое заклинание'}
		onCancel={onCancelPopup}
		color='blue'
		onDelete={spell ? onDelete : undefined}
		onSaveWithHeader={onSave}
		textareaCN={styles['spells-textarea']}>
		<div className={styles['spell-info-edit-wrap']}>
			<div className={styles['edit-spell-line']}>
				<div className={styles['edit-player-spell-info-wrapper']}>
					<NumberInput
						buttonCN={styles['input-text-edit-button']}
						inputCN={styles['input-edit-spell-focus']}
						textCN={styles['input-text-edit-spell']}
						wrapperCN={styles['input-wrapper']}
						initialValue={level}
						valMustBeGreaterZero
						onSave={(value)=>{setLevel(value);}}
					></NumberInput>
					<div className={styles['edit-player-spell-info-label']}>Уровень заклинания</div>
				</div>
				<div className={styles['edit-player-spell-info-wrapper']}>
					<TextInput 
						buttonCN={styles['input-text-edit-button']}
						inputCN={styles['input-edit-spell-focus']}
						textCN={styles['input-text-edit-spell']}
						wrapperCN={styles['input-wrapper']}
						initialText={distance ? distance : ''}
						onSave={(text)=>{setDistance(text);}}>
					</TextInput>
					<div className={styles['edit-player-spell-info-label']}>Дистанция</div>
				</div>
				<div className={styles['edit-player-spell-info-wrapper']}>
					<TextInput 
						buttonCN={styles['input-text-edit-button']}
						inputCN={styles['input-edit-spell-focus']}
						textCN={styles['input-text-edit-spell']}
						wrapperCN={styles['input-wrapper']}
						initialText={duration ? duration : ''}
						onSave={(text)=>{setDuration(text);}}>
					</TextInput>
					<div className={styles['edit-player-spell-info-label']}>Длительность</div>
				</div>
				<div className={styles['edit-player-spell-info-wrapper']}>
					<TextInput 
						buttonCN={styles['input-text-edit-button']}
						inputCN={styles['input-edit-spell-focus']}
						textCN={styles['input-text-edit-spell']}
						wrapperCN={styles['input-wrapper']}
						initialText={castTime ? castTime : ''}
						onSave={(text)=>{setCastTime(text);}}>
					</TextInput>
					<div className={styles['edit-player-spell-info-label']}>Время каста</div>
				</div>
			</div>
			<div className={styles['edit-spell-line']}>
				<div>
					<input id='is-aim' type='checkbox' checked={aim ? aim : false} onChange={()=>setAim(!aim)}/>
					<label htmlFor='is-aim' className={styles['edit-player-spell-info-label']}>Нужно целиться?</label>
				</div>
				<div>
					<input id='is-conc' type='checkbox' checked={concentration ? concentration : false} onChange={()=>setConcentration(!concentration)}/>
					<label htmlFor='is-conc' className={styles['edit-player-spell-info-label']}>Требует концентрации?</label>
				</div>
			</div>
			<div className={styles['edit-spell-line']}>
				<div className={styles['edit-player-spell-info-label']}>Компоненты:</div>
				<div className={styles['tags-line']}>
					<Eye offsetHint={35} text={verbalComponentDescription} ElementIstead={
						<div className={
							cn(styles['component'], isComponentInList('В') ? styles['c-active'] : styles['c-inactive'])
						} onClick={()=>onClickComponent(verbalComponentTemplate)}>
							Вербальный
						</div>
					}/>
					<Eye offsetHint={35} text={somaticComponentDescription} ElementIstead={
						<div className={
							cn(styles['component'], isComponentInList('С') ? styles['c-active'] : styles['c-inactive'])
						} onClick={()=>onClickComponent(somaticComponentTemplate)}>
							Соматический
						</div>
					}/>
					<Eye offsetHint={35} text={materialComponentDescription} ElementIstead={
						<div className={
							cn(styles['component'], isComponentInList('М') ? styles['c-active'] : styles['c-inactive'])
						} onClick={()=>onClickComponent({...materialComponentTemplate, extra: undefined})}>
							Материальный
						</div>
					}/>
				</div>
			</div>
			<div className={styles['edit-spell-line']}>
				<div className={styles['edit-player-spell-info-label']}>Доступно для:</div>
				<div className={styles['tags-line']}>
					{cellsColorObj.map(el => 
						<div key={el.src} className={
							cn(styles['component'], isClassInList(el.title) ? styles['c-active'] : styles['c-inactive'])
						} onClick={()=>onClickClasslist({name: el.title})}>
							{el.title}
						</div>
					)}
				</div>
			</div>
			<div className={styles['spell-dmg-wrapper']}>
				<div className={styles['dmg-line']}>
					<span className={attackStyles['preset-name']}>Урон</span>
					<div className={styles['dmg-line-right']}>
						{damageRoll && damageRoll.map(el => 
							<DamageRegex
								key={randomHash()}
								inputDamageRoll={el}
								inputDmgId={el.dmg_id}
								onSave={onSaveDamageParser}
							/>
						)}
						{addDamageClicked && 
							<DamageRegex 
								inputDamageRoll={getDmgPreset()}
								onSave={onSaveDamageParser}
							/>}
						{!addDamageClicked && ((damageRoll && damageRoll.length < MAX_DAMAGES_PER_ITEM) || !damageRoll) &&
							<button className={cn(styles['add-damage-button'], 'small-shadow')} onClick={()=>setAddDamageClicked(true)}>
								<img src='/plus.svg' alt='add dmg' className={attackStyles['add-btn']}/>
							</button>
						}
					</div>
				</div>
				{damageRoll && damageRoll.map(dmg => (
					<div className={attackStyles['damage']} key={dmg.dmg_id}>
						<div className={attackStyles['damage-value']}>
							<input 
								type='number' 
								className={attackStyles['dice-count']} 
								value={dmg.value.count} 
								onChange={(e)=> e.target.value === '' ? 
									onChangeDmgDiceCount(dmg.dmg_id, 0) : 
									onChangeDmgDiceCount(dmg.dmg_id, parseInt(e.target.value))}/>
							<span className={attackStyles['dice-k']}>К</span>
							<select 
								name='dice' 
								className={attackStyles['dice-value']}
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
						<div className={cn(attackStyles['input-wrapper'], attackStyles['background-wrapper'])}>
							<label htmlFor='dmg-mod' className={attackStyles['weapon-label']}>Модификатор</label>
							<input 
								id='dmg-mod'
								type='number' 
								value={dmg.modifiers} 
								className={cn(attackStyles['weapon-input'], attackStyles['number-input'])}
								onChange={(e)=> e.target.value === '' ? 
									onChangeDmgDiceMod(dmg.dmg_id, 0) :
									onChangeDmgDiceMod(dmg.dmg_id, parseInt(e.target.value))}
							/>
						</div>
						<select 
							className={attackStyles['dmg-type']}
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
						<button className={attackStyles['remove-dmg']} onClick={()=>removeDmg(dmg.dmg_id)}>
							<img src='/x.svg' alt='remove damage' className={attackStyles['remove-icon']}/>
						</button>
					</div>
				))}
				{(!damageRoll || (damageRoll && damageRoll.length < MAX_DAMAGES_PER_ITEM)) &&
				<button className={attackStyles['add-dmg']} onClick={addDmg}>
					<img src='/plus.svg' alt='add weapon' className={attackStyles['add-btn']}/>
				</button>}
			</div>
			<span className={attackStyles['preset-name']}>Описание</span>
		</div>
	</EditTextPopup>;
}