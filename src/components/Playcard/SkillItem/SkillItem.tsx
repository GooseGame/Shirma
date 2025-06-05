import { SkillItemProps } from './SkillItem.props';
import styles from './SkillItem.module.css';
import cn from 'classnames';

export function SkillItem ({skill, useProfRadio = true, width = 1, showAsModifier = true, handleSkillCheckClick, handleClickRadio, handleClickText}: SkillItemProps) {
	const handleClick = () => {
		if (handleSkillCheckClick) {
			handleSkillCheckClick(skill.modifier);
		}
	};
	const getRadioLevelClassName = (level: 0|0.5|1|2): string => {
		if (level === 0) return 'zero-prof';
		if (level === 0.5) return 'half-prof';
		if (level === 1) return 'prof';
		if (level === 2) return 'double-prof';
		return'zero-prof';
	};
	return <div className={cn(styles['skill-wrapper'], width === 1 ? styles['full-width'] : styles['half'] )}>
		{useProfRadio && <div className={styles['radio-wrap']}>
			<div className={cn(styles['prof-radio'],styles[getRadioLevelClassName(skill.profLevel)])} onClick={handleClickRadio}>
				{skill.profLevel === 0.5 && <img src='/half.svg' alt='half' className={styles['half-icon']}/>}
			</div>
		</div> 
		}
		<span className={styles['skill-name']} onClick={handleClickText}>
			{skill.name}
		</span>
		<div className={styles['skill-mod']} onClick={()=>handleClick()}>
			{(skill.modifier > 0 && showAsModifier ? '+' : '')+skill.modifier}
		</div>
	</div>;
}