import { useEffect, useState } from 'react';
import { Skill, Stat } from '../../../../interfaces/Character.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import styles from './Characteristics.module.css';
import cn from 'classnames';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';

interface EditStatProps {
	onChangeChar: () => void, 
	id: string, 
	proficiency: number, 
	statClicked?: Stat,
	onCancel: ()=>void
}

export function EditStat({onChangeChar, id, proficiency, statClicked, onCancel}: EditStatProps) {
	const dispatch = useDispatch<AppDispatch>();
	const [savedStatName, setSavedStatName] = useState<string>();
	const [savedStatScore, setSavedStatScore] = useState<number>();
	const [savedBonus, setSavedBonus] = useState<number>();
	const [savedSkills, setSavedSkills] = useState<Skill[]>();
	const [savedMod, setSavedMod] = useState<number>();
	const [savedProf, setSavedProf] = useState<(0|0.5|1|2)>(0);

	useEffect(()=>{
		if (statClicked) {
			fillStat(statClicked);
		}
	},[statClicked]);

	const fillStat = (stat: Stat) => {
		setSavedStatName(stat.name);
		setSavedStatScore(stat.score);
		setSavedBonus(stat.saveBonus);
		setSavedSkills(stat.skills);
		setSavedMod(stat.modifier);
		setSavedProf(stat.saveProf);
	};

	const onCancelEditStat = () => {
		setSavedStatName(undefined);
		setSavedStatScore(undefined);
		setSavedBonus(undefined);
		setSavedSkills(undefined);
		setSavedMod(undefined);
		setSavedProf(0);
		onCancel();
	};

	const onSaveStat = (stat: Stat) => {
		dispatch(charActions.editStat({id, value: stat}));
		onChangeChar();
	};

	const onChangeStatScore = (score: number) => {
		if (score > 0) {
			setSavedStatScore(score);
			const mod = Math.round((score - 10 - 1)/2);
			setSavedMod(mod);
			changeSkillsModifier(mod);
		}
	};

	const onChangeSaveBonus = (bonus: number) => {
		setSavedBonus(bonus);
	};

	const changeSkillsModifier = (mod: number) => {
		const recountedSkills = savedSkills?.map(skill => ({
			...skill,
			modifier: (mod + Math.round(proficiency*skill.profLevel) + (skill.bonus?skill.bonus:0))
		}));
		setSavedSkills(recountedSkills);
	};

	const handleSaveStat = () => {
		const bonus = (Number.isNaN(savedBonus) || savedBonus === 0) ? undefined : savedBonus;
		if ((savedStatScore && savedStatScore > 0) && savedStatName && savedMod && savedSkills) {
			onSaveStat({
				name: savedStatName,
				score: savedStatScore,
				modifier: savedMod,
				saveBonus: bonus,
				saveProf: savedProf,
				skills: savedSkills
			});
			onCancel();
		}
	};

	const getEditStatChildren = () => {
		const isValid = (savedMod && !Number.isNaN(savedMod)); 
		return <div className={styles['edit-stat-wrapper']}>
			<div className={styles['edit-stat-line']}>
				<label htmlFor='score' className={styles['edit-stat-label']}>
					Значение характеристики
				</label>
				<input 
					name='score'
					type='number' 
					className={styles['edit-stat-input']} 
					placeholder='Введите значение характеристики' 
					value={savedStatScore?savedStatScore:0}
					onChange={(e)=>onChangeStatScore(parseInt(e.target.value))}
				/>
			</div>
			<div className={styles['edit-stat-line']}>
				<label htmlFor='score' className={styles['edit-stat-label']}>
					Бонус к спасброску
				</label>
				<input 
					name='bonus'
					type='number' 
					className={styles['edit-stat-input']} 
					placeholder='Введите бонус к спасброску' 
					value={savedBonus ? savedBonus : 0}
					onChange={(e)=>onChangeSaveBonus(parseInt(e.target.value))}
				/>
			</div>
			<div className={cn(styles['save-btn'], isValid ? '' : styles['invisible'])} onClick={handleSaveStat}>
				<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
			</div>
		</div>;
	};

	const isPrepared = () => {
		return ((savedStatScore && savedStatScore > 0) && savedStatName && savedMod && savedSkills && statClicked);
	};
	
	if (!isPrepared) {
		return <></>;
	} else {
		return <EditCustomPopup 
			wrapperCN={styles['edit-stat-wrapper']} 
			onCancel={onCancelEditStat} color='red' 
			header={`${savedStatName} ${(savedMod && savedMod>0)?'+':''}${savedMod}`}
		>
			{getEditStatChildren()}
		</EditCustomPopup>;
	}
}