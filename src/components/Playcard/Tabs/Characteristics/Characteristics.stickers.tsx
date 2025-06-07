/* eslint-disable no-mixed-spaces-and-tabs */
import { splitStatsBalanced } from '../../../../helpers/stats';
import { Skill, Stat, Status } from '../../../../interfaces/Character.interface';
import { RoundButton } from '../../../Button/Button';
import { Eye } from '../../../Eye/Eye';
import { SkillItem } from '../../SkillItem/SkillItem';
import styles from './Characteristics.module.css';
import cn from 'classnames';

interface characteristicsTableProps {
	stats: Stat[], 
	handleSkillCheckClick: (modifier: number) => void, 
	onSaveSkillProf: (level: 0|0.5|1|2, statModifier: number, statName: string, skill: Skill) => void,
	onClickStat: (stat: Stat) => void;
	onClickSkill: (stat: Stat, skill: Skill) => void;
	onSaveProf: (level: 0|0.5|1|2, stat: Stat) => void,
	proficiency: number
}
export function getCharacteristicsTableTSX({stats, handleSkillCheckClick, onSaveSkillProf, onClickStat, onClickSkill, onSaveProf, proficiency}: characteristicsTableProps) {
	const incLevel = (level: 0|1|0.5|2) => {
		if (level === 0) return 0.5;
		if (level === 0.5) return 1;
		if (level === 1) return 2;
		if (level === 2) return 0;
		return 2;
	};
	const [statsBalanced1, statsBalanced2] = splitStatsBalanced(stats);
	return <div className={styles['stats-wrapper']}>
		<div className={styles['stat-column']}>
			{statsBalanced1.map(stat => (
				<div key={stat.name} className={styles['stat-wrap']}>
					<div className={styles['stat-head']} onClick={()=>onClickStat(stat)}>
						<span className={styles['stat-text']}>{stat.name}</span>
						<span className={styles['stat-text']}>{stat.score}</span>
					</div>
					<div className={styles['stat-checks']}>
						<SkillItem 
							skill={{
								name: 'Проверка',
								profLevel: stat.saveProf,
								modifier: stat.modifier
							}}
							width={0.5}
							useProfRadio={false}
							handleSkillCheckClick={handleSkillCheckClick}
							handleClickText={()=>onClickStat(stat)}
						/>
						<SkillItem 
							skill={{
								name: 'Спасбросок',
								profLevel: stat.saveProf,
								modifier: (stat.modifier + (proficiency * stat.saveProf) + (stat.saveBonus ? stat.saveBonus : 0) )
							}}
							useProfRadio
							width={0.5}
							handleSkillCheckClick={handleSkillCheckClick}
							handleClickText={()=>onClickStat(stat)}
							handleClickRadio={()=>onSaveProf(incLevel(stat.saveProf), stat)}
						/>
					</div>
					<div className={styles['skills']}>
						{stat.skills.map(skill => (
							<SkillItem 
								key={skill.name} 
								skill={skill} 
								useProfRadio 
								handleSkillCheckClick={handleSkillCheckClick}
								handleClickRadio={()=>onSaveSkillProf(incLevel(skill.profLevel), stat.modifier, stat.name, skill)}
								handleClickText={()=>onClickSkill(stat, skill)}
							/>
						))}
					</div>
				</div>
			))}
		</div>
		<div className={styles['stat-column']}>
			{statsBalanced2.map(stat => (
				<div key={stat.name} className={styles['stat-wrap']}>
					<div className={styles['stat-head']} onClick={()=>onClickStat(stat)}>
						<span className={styles['stat-text']}>{stat.name}</span>
						<span className={styles['stat-text']}>{stat.score}</span>
					</div>
					<div className={styles['stat-checks']}>
						<SkillItem 
							skill={{
								name: 'Проверка',
								profLevel: stat.saveProf,
								modifier: stat.modifier
							}}
							width={0.5}
							useProfRadio={false}
							handleSkillCheckClick={handleSkillCheckClick}
							handleClickText={()=>onClickStat(stat)}
						/>
						<SkillItem 
							skill={{
								name: 'Спасбросок',
								profLevel: stat.saveProf,
								modifier: (stat.modifier + (proficiency * stat.saveProf) + (stat.saveBonus ? stat.saveBonus : 0) )
							}}
							useProfRadio
							width={0.5}
							handleSkillCheckClick={handleSkillCheckClick}
							handleClickText={()=>onClickStat(stat)}
							handleClickRadio={()=>onSaveProf(incLevel(stat.saveProf), stat)}
						/>
					</div>
					<div className={styles['skills']}>
						{stat.skills.map(skill => (
							<SkillItem 
								key={skill.name} 
								skill={skill} 
								useProfRadio 
								handleSkillCheckClick={handleSkillCheckClick}
								handleClickRadio={()=>onSaveSkillProf(incLevel(skill.profLevel), stat.modifier, stat.name, skill)}
								handleClickText={()=>onClickSkill(stat, skill)}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	</div>;
}

function getPassiveCheck(statName: string, skillName: string, stats: Stat[]): Skill|undefined {
	const searchedStat = stats.find(statEl => statEl.name === statName);
	if (searchedStat) {
		const searchedSkill = searchedStat.skills.find(skillEl => skillEl.name === skillName);
		if (searchedSkill) {
			return {
				name: `${statName} (${skillName})`,
				profLevel: searchedStat.saveProf,
				modifier: (10 + searchedSkill.modifier)
			};
		}
	}
}

export function getPassivesTSX(stat: Stat[]) {
	const passivePerceptionCheck = getPassiveCheck('Мудрость', 'Внимание', stat);
	const passiveInsightCheck = getPassiveCheck('Мудрость', 'Проницательность', stat);
	const passiveAnalysisCheck = getPassiveCheck('Интелект', 'Анализ', stat);

	return <div className={styles['stats-wrapper']}>
		{passivePerceptionCheck && <SkillItem width={1} skill={passivePerceptionCheck} showAsModifier={false} useProfRadio={false}/>}
		{passiveInsightCheck && <SkillItem width={1} skill={passiveInsightCheck} showAsModifier={false} useProfRadio={false}/>}
		{passiveAnalysisCheck && <SkillItem width={1} skill={passiveAnalysisCheck} showAsModifier={false} useProfRadio={false}/>}
	    </div>;
}

export function getConditionTSX(conditions: Status[]) {
	return <div className={styles['conditions-wrapper']}>
		{conditions.length === 0 && <div className={styles['add-new']}>
			<span className={styles['add-new-text']}>Добавить состояние</span>
			<RoundButton size={'20'} isRed><img src='/plus.svg' alt='add'/></RoundButton>
		</div>}
		{conditions.map(cond => (
			<div className={styles['cond-item']}>
			    <span key={cond.name} className={styles['cond-name']}>{cond.name}</span>
				<Eye floatRight text={cond.description}/>
			</div>
		))}
	</div>;
}

export function getActionsTSX() {
	return <div className={styles['actions-wrapper']}>
		<div className={styles['action']}>
			<span className={styles['action-name']}>Лечение</span>
			<RoundButton classNames={styles['action-btn']}><img src='/heal.svg' className={styles['action-btn-logo']} alt='heal'/></RoundButton>
		</div>
		<div className={styles['action']}>
			<span className={styles['action-name']}>Урон</span>
			<RoundButton classNames={styles['action-btn']}><img src='/damage2.svg' className={styles['action-btn-logo']} alt='heal'/></RoundButton>
		</div>
		<div className={styles['action']}>
			<span className={styles['action-name']}>Доп ХП</span>
			<RoundButton classNames={styles['action-btn']}><img src='/additional_hp2.svg' className={cn(styles['action-btn-logo'], styles['action-additional'])} alt='additional'/></RoundButton>
		</div>
	</div>;
}