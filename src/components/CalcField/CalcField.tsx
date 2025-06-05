import { CalcFieldProps } from './CalcField.props';
import styles from './CalcField.module.css';
import cn from 'classnames';

export function CalcField({inputValue, setInputValue, leftCustomElem, validator, rightResultElem}: CalcFieldProps) {

	const inputValidator = (inputValue: string) => {
		if (validator(inputValue)) {
			setInputValue(inputValue);
		} else {
			if (['-','+','*'].includes(inputValue[inputValue.length-1])) {
				setInputValue(inputValue);
			}
		}
	};

	return <div className={styles['container']}>
		{leftCustomElem}
		<input type='text' className={cn(styles['form'], leftCustomElem ? styles['form-combined'] : '')} value={inputValue} onChange={(e)=>inputValidator(e.target.value)}/>
		{rightResultElem}
	</div>;
}