import { useEffect, useState } from 'react';
import { Skill } from '../../../../interfaces/Character.interface';
import styles from './Characteristics.module.css';
import { useDispatch } from 'react-redux';
import { charActions } from '../../../../store/slices/Characters.slice';
import { AppDispatch } from '../../../../store/store';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';

interface EditSkillProps {
	onChangeChar: (popupText?: string, popupHeader?: string) => void, 
	id: string, 
	proficiency: number, 
	skillClicked?: Skill,
	onCancel: ()=>void,
	statName: string,
	statMod: number
}

export function EditSkill({onChangeChar, id, proficiency, skillClicked, onCancel, statName, statMod}: EditSkillProps) {
	const [savedSkillName, setSavedSkillName] = useState<string>();
	const [savedSkillBonus, setSavedSkilBonus] = useState<number>();
	const [savedSkillProf, setSavedSkillProf] = useState<(0|0.5|1|2)>();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(()=>{
		if (skillClicked) {
			fillSkill(skillClicked);
		}
	},[skillClicked]);

	const onCancelSkillEdit = () => {
		setSavedSkillName(undefined);
		setSavedSkilBonus(undefined);
		setSavedSkillProf(undefined);
		onCancel();
	};

	const fillSkill = (skill: Skill) => {
		setSavedSkillName(skill.name);
		setSavedSkilBonus(skill.bonus);
		setSavedSkillProf(skill.profLevel);
	};

	const onSaveSkill = (skill: Skill) => {
		dispatch(charActions.editSkill({id, value: {
			statName,
			skill
		}}));
		onChangeChar(`(${skill.name})`,'Изменён навык:');
	};

	const onChangeBonus = (bonus: number) => {
		setSavedSkilBonus(bonus);
	};

	const handleSaveSkill = () => {
		const bonus = (Number.isNaN(savedSkillBonus) || savedSkillBonus === 0) ? undefined : savedSkillBonus;
		if (skillClicked && savedSkillName && savedSkillProf !== undefined) {
			onSaveSkill({
				name: savedSkillName,
				modifier: statMod+Math.round(proficiency*skillClicked.profLevel)+(savedSkillBonus?savedSkillBonus:0),
				profLevel: savedSkillProf,
				bonus
			});
			onCancel();
		}
	};

	const getEditSkillChildren = () => {
		return <div className={styles['edit-stat-wrapper']}>
			<div className={styles['edit-stat-line']}>
				<label htmlFor='bonus' className={styles['edit-stat-label']}>
					Бонус умения
				</label>
				<input 
					name='bonus'
					type='number' 
					className={styles['edit-stat-input']} 
					placeholder='Введите бонус умения' 
					value={savedSkillBonus?savedSkillBonus:0}
					onChange={(e)=>onChangeBonus(parseInt(e.target.value))}
				/>
			</div>
			<div className={styles['save-btn']} onClick={handleSaveSkill}>
				<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
			</div>
		</div>;
	};

	if (!EditSkill) {
		return <></>;
	} else {
		return <EditCustomPopup 
			wrapperCN={styles['edit-stat-wrapper']} 
			onCancel={onCancelSkillEdit} color='darker-red' 
			header={savedSkillName?savedSkillName:'Это че'}
		>
			{getEditSkillChildren()}
		</EditCustomPopup>;
	}
}