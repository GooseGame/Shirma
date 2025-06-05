import { useState } from 'react';
import { DamageRegexProps } from './DaamageRegex.props';
import { getDamageById } from '../../helpers/attributes';
import styles from './DamageRegex.module.css';
import { textToDamage } from '../../helpers/parser';
import cn from 'classnames';

export function DamageRegex({inputDamageRoll, onSave, inputDmgId}: DamageRegexProps) {
	const transformDmgToText = () => {
		const damageType = getDamageById(inputDamageRoll.typeId);
		return `${inputDamageRoll.value.count}к${inputDamageRoll.value.edge}${inputDamageRoll.modifiers !== 0 ? (inputDamageRoll.modifiers > 0 ? ' +':' -')+inputDamageRoll.modifiers.toString():''} ${damageType ? damageType.name : 'колющий'}`;
	};
	const [textVal, setTextVal] = useState(transformDmgToText());

	const isSimplyValid = (val: string): boolean => {
		if (val.length > 30) return false;
		if (val === '') return true;
		// Разрешаем:
		// - цифры (\d)
		// - "к" (русская)
		// - "+", "-" (только если они используются корректно)
		// - пробелы (\s)
		// - русские буквы (а-яА-ЯёЁ)
		const regex = /^[0-9кК+\-\sа-яА-ЯёЁ]+$/;
		
		// Запрещаем:
		// - латиницу (a-z, d)
		// - спецсимволы (*, &, | и т.д.)
		if (!regex.test(val)) return false;
		
		// // Доп. проверки структуры:
		// // 1. Нельзя два плюса/минуса подряд ("++", "--")
		if (/[+-]{2,}/.test(val)) return false;
		
		return true;
	};

	const handleClickSave = () => {
		if (textVal === '') {
			onSave(null, inputDmgId);
			return;
		}
		const dmg = textToDamage(textVal, inputDmgId);
		if (dmg !== null) {
			onSave(dmg, inputDmgId);
		}
	};

	return <div className={cn(styles['wrapper'], 'small-shadow')}>
		<input 
			type='text' 
			value={textVal} 
			onChange={(e)=>{if (isSimplyValid(e.target.value)) {setTextVal(e.target.value);}}} 
			className={styles['input']}
			placeholder='Например: 1к4+5 колющий'/>
		<button className={styles['button']} onClick={handleClickSave}>
			<img src='/more-white.svg' alt='confirm' className={styles['img']}/>
		</button>
	</div>;
}