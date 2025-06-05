import { TextInputProps } from './NumberInput.props';
import styles from './NumberInput.module.css';
import cn from 'classnames';
import { useState } from 'react';

export function NumberInput(
	{
		initialValue, 
		onSave, 
		textCN, 
		inputCN, 
		wrapperCN, 
		buttonCN, 
		imgBlack, 
		valMustBeGreaterZero, 
		isParentFocus, 
		setIsParentFocus
	}: TextInputProps) {
	const [val, setVal] = useState<number>(initialValue);
	const [isFocusing, setIsFocusing] = useState(false);

	const setFocus = (value: boolean) => {
		if (setIsParentFocus) {
			setIsParentFocus(value);
		} else setIsFocusing(value);
	};

	const isFocus = () => {
		return (isParentFocus !== undefined) ? isParentFocus : isFocusing;
	};

	const onCancel = () => {
		setFocus(false);
		setVal(initialValue);
	};

	const onSaveVal = () => {
		if (!Number.isNaN(val)) {
			onSave(val); 
			setFocus(false);
		} else {
			onCancel();
		}
	};

	const isValid = () => {
		return !Number.isNaN(val) && (valMustBeGreaterZero ? (val >= 0) : true);
	};

	return <div className={cn(styles['wrapper'], wrapperCN)} onMouseLeave={onCancel}>
		{!isFocus() && <div className={cn(styles['text'], textCN)} onClick={()=>setFocus(true)}>{val}</div>}
		{isFocus() && 
			<input 
				type='number' 
				placeholder={val.toString()} 
				value={val} 
				className={cn(styles['input'], inputCN)} 
				onChange={(e)=>(e.target.value !== '') ? setVal(parseInt(e.target.value)) : setVal(0)}
			/>}
		{(isFocus() && isValid()) && <div className={cn(styles['confirm'], buttonCN)} onClick={onSaveVal}>
			<img src={!imgBlack ? '/more-white.svg' : '/more.svg'} alt='confirm' className={styles['img']}/>
		</div>}
	</div>;
}