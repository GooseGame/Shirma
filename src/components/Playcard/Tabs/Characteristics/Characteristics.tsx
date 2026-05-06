import { Sticker } from '../../Sticker/Sticker';
import { TabsProps } from '../Tabs.props';
import { Text } from '../../../../interfaces/Text.interface';
import { getCharacteristicsTableTSX, getPassivesTSX } from './Characteristics.stickers';
import styles from './Characteristics.module.css';
import cn from 'classnames';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import { EditTextPopup } from '../../../EditTextPopup/EditTextPopup';
import { MAX_EXHAUSTION_LVL, NO_EXHAUSTION_LVL, Skill, Stat } from '../../../../interfaces/Character.interface';
import { EditStat } from './Characteristics.editStat';
import { EditSkill } from './Characteristics.editSkill';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';

export function Characteristics({player, setDiceRoll, onChangeChar}: TabsProps) {
	const [editHeader, setEditHeader] = useState('');
	const [editText, setEditText] = useState<Text>();
	const dispatch = useDispatch<AppDispatch>();
	const [statClicked, setStatClicked] = useState<Stat>();
	const [skillClicked, setSkillClicked] = useState<Skill>();
	const [statOfSkill, setStatOfSkill] = useState<Stat>();
	const [isShowArmorPopup, setIsShowArmorPopup] = useState(false);
	const [isShowSpeedPopup, setIsShowSpeedPopup] = useState(false);
	const [savedArmor, setSavedArmor] = useState(player.condition.armor);
	const [savedSpeed, setSavedSpeed] = useState(player.condition.speed);

	const onClickStat = (stat: Stat) => {
		setStatClicked(stat);
	};

	const onCancelStat = () => {
		setStatClicked(undefined);
	};

	const onClickSkill = (stat: Stat, skill: Skill) => {
		setSkillClicked(skill);
		setStatOfSkill(stat);
	};

	const onCancelSkill = () => {
		setSkillClicked(undefined);
		setStatOfSkill(undefined);
	}; 

	const handleClickAdditional = () => {
		setEditText(player.info.text.prof);
		setEditHeader('Изменить способности и умения');
	};

	const reset = () => {
		setEditText(undefined);
		setEditHeader('');
		if (onChangeChar) onChangeChar();
	};

	const onCancel = () => {
		setEditText(undefined);
		setEditHeader('');
	};

	const onSave = (text: Text) => {
		dispatch(charActions.editText({id: player.id, text, property: 'prof'}));
		reset();
	};

	const onSaveSkillProf = (level: 0|1|0.5|2, statModifier: number, statName: string, skill: Skill) => {
		const skillItem: Skill = {
			name: skill.name,
			profLevel: level,
			modifier: Math.round(level * player.proficiency) + statModifier + (skill.bonus ? skill.bonus : 0),
			bonus: skill.bonus
		};
		dispatch(charActions.editSkill({id: player.id, value: {statName, skill: skillItem}}));
		if (onChangeChar) onChangeChar();
	};

	const onSaveProf = (level: 0|1|0.5|2, stat: Stat) => {
		dispatch(charActions.editStat({id: player.id, value: {
			...stat, 
			saveProf: level
		}}));
		if (onChangeChar) onChangeChar();
	};

	const handleSkillCheckClick = (modifier: number) => {
		if (setDiceRoll) setDiceRoll([
			{
				typeId: 0,
				modifiers: modifier,
				value: {
					count: 1,
					edge: 20
				}
			}
		]);
	}; 

	const handleSaveExhaustionLvl = (lvl: number) => {
		if (lvl >= NO_EXHAUSTION_LVL && lvl <= MAX_EXHAUSTION_LVL) {
			dispatch(charActions.editExhaustion({id: player.id, value: lvl}));
			if (onChangeChar) onChangeChar();
		}
	};

	const onCancelArmorPopup = () => {
		setSavedArmor(player.condition.armor);
		setIsShowArmorPopup(false);
	};
	const onCancelSpeedPopup = () => {
		setSavedSpeed(player.condition.speed);
		setIsShowSpeedPopup(false);
	};
	const onSaveArmor = () => {
		if (savedArmor < 0) return;
		dispatch(charActions.editArmor({ id: player.id, value: savedArmor }));
		if (onChangeChar) onChangeChar(`Защита: ${player.condition.armor} - ${savedArmor}`, 'Изменены характеристики');
		setIsShowArmorPopup(false);
	};
	const onSaveSpeed = () => {
		if (savedSpeed < 0) return;
		dispatch(charActions.editSpeed({ id: player.id, value: savedSpeed }));
		if (onChangeChar) onChangeChar(`Скорость: ${player.condition.speed} - ${savedSpeed}`, 'Изменены характеристики');
		setIsShowSpeedPopup(false);
	};

	return <>
		{isShowArmorPopup && <EditCustomPopup
			onCancel={onCancelArmorPopup}
			color='darker-red'
			header='Защита'
			wrapperCN={styles['armor-speed-popup']}
		>
			<div className={styles['armor-speed-popup-content']}>
				<label htmlFor='armor-input' className={styles['armor-speed-popup-label']}>Значение</label>
				<input
					id='armor-input'
					type='number'
					value={savedArmor}
					onChange={(e)=> e.target.value !== '' ? setSavedArmor(parseInt(e.target.value)) : setSavedArmor(0)}
					className={styles['armor-speed-popup-input']}
				/>
				<div className={styles['save-btn']} onClick={onSaveArmor}>
					<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
				</div>
			</div>
		</EditCustomPopup>}
		{isShowSpeedPopup && <EditCustomPopup
			onCancel={onCancelSpeedPopup}
			color='darker-red'
			header='Скорость'
			wrapperCN={styles['armor-speed-popup']}
		>
			<div className={styles['armor-speed-popup-content']}>
				<label htmlFor='speed-input' className={styles['armor-speed-popup-label']}>Значение</label>
				<input
					id='speed-input'
					type='number'
					value={savedSpeed}
					onChange={(e)=> e.target.value !== '' ? setSavedSpeed(parseInt(e.target.value)) : setSavedSpeed(0)}
					className={styles['armor-speed-popup-input']}
				/>
				<div className={styles['save-btn']} onClick={onSaveSpeed}>
					<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
				</div>
			</div>
		</EditCustomPopup>}
		<div className={styles['armor-speed-row']}>
			<div className={styles['armor-speed-item']} onClick={()=>setIsShowArmorPopup(true)}>
				<div className={styles['armor-speed-title']}>Защита</div>
				<div className={styles['armor-speed-value']}>{player.condition.armor}</div>
			</div>
			<div className={styles['armor-speed-item']} onClick={()=>setIsShowSpeedPopup(true)}>
				<div className={styles['armor-speed-title']}>Скорость</div>
				<div className={styles['armor-speed-value']}>{player.condition.speed}</div>
			</div>
		</div>
		<Sticker width={0.5} fullHeight bodyContent={
			{
				type: 'list',
				children: <div>
					{getCharacteristicsTableTSX({stats: player.stats, handleSkillCheckClick, onSaveSkillProf, onClickStat, onClickSkill, onSaveProf, proficiency: player.proficiency})}
					<div className={styles['passive-wrapper']}>
						<h2 className={styles['passive-header-mobile']}>Пассивные чувства</h2>
						{getPassivesTSX(player.stats)}
					</div>
				</div>
			}
		} stickerCN={cn('big-shadow', styles['gapless'], styles['scrollable-mobile'])}/>
		<Sticker width={0.25} stickerCN={styles['hide-tall']} header='Пассивные чувства' scrollable bodyContent={
			{
				type: 'list',
				children: getPassivesTSX(player.stats)
			}
		}/>
		<Sticker width={0.25} header='Доп. способности и умения' onClick={handleClickAdditional} scrollable hasAddButton eyesRight={true} bodyContent={player.info.text.prof} />
		<div className={styles['small-stickers']}>
			<div className={cn(styles['small-sticker-wrapper'], styles['exhaustion-sticker'], styles['invisible'], 'big-shadow')}>
				<div 
					className={
						cn(
							styles['exhaustion'], 
							styles['less'],
							(player.condition.exhaustionLvl > NO_EXHAUSTION_LVL) ? 
								styles['visible'] : 
								styles['invisible']
						)} 
					onClick={()=>handleSaveExhaustionLvl(player.condition.exhaustionLvl-1)}
				>
					<img src='/more-white.svg' alt='less exhaustion' className={cn(styles['exhaustion-img'], styles['exhaustion-less'])}/>
				</div>
				<div className={styles['exhaustion-info']}>
					<h2 className={cn(styles['small-sticker-head'], player.condition.exhaustionLvl === 0 ? styles['unable'] : '')}>Истощение</h2>
					{player.condition.exhaustionLvl > NO_EXHAUSTION_LVL && <h2 className={cn(styles['small-sticker-head'], styles['red'])}>{player.condition.exhaustionLvl}</h2>}
				</div>
				<div 
					className={
						cn(
							styles['exhaustion'],
							styles['more'],
							(player.condition.exhaustionLvl < MAX_EXHAUSTION_LVL) ? 
								styles['visible'] : 
								styles['invisible']
						)} 
					onClick={()=>handleSaveExhaustionLvl(player.condition.exhaustionLvl+1)}
				>
					<img src='/more-white.svg' alt='more exhaustion' className={cn(styles['exhaustion-img'], styles['exhaustion-more'])}/>
				</div>
			</div>
		</div>
		{/* <Sticker width={0.25} header='Действия' bodyContent={{type: 'list', children: getActionsTSX()}} /> */}
		<EditTextPopup header={editHeader} onCancel={onCancel} onSave={onSave} color='darker-red' editValue={editText}/>
		{(onChangeChar && statClicked) && <EditStat onCancel={onCancelStat} onChangeChar={onChangeChar} id={player.id} proficiency={player.proficiency} statClicked={statClicked}/>}
		{(onChangeChar && skillClicked && statOfSkill) && <EditSkill statMod={statOfSkill.modifier} statName={statOfSkill.name} onCancel={onCancelSkill} onChangeChar={onChangeChar} id={player.id} proficiency={player.proficiency} skillClicked={skillClicked}/>}
	</>;
}
