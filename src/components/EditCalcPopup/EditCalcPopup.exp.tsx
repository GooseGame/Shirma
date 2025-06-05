import { useState } from 'react';
import { CalcField } from '../CalcField/CalcField';
import styles from './EditCalcPopup.module.css';
import { EditCustomPopup } from '../EditCustomPopup/EditCustomPopup';
import { EditCalcPopupProps } from './EditCalcPopup.props';
import { thatLevelLowBorder } from '../../helpers/experience';
import { CalcButton } from '../CalcButton/CalcButton';
import { onClickNumberAction, onClickOperatorAction, validator, onClickAdd, onClickRemove } from './EditCalcPopup.helpers';
import cn from 'classnames';

interface EditCalcPopupCoinsProps extends EditCalcPopupProps {
	onSave: (value: number)=>void,
	onLVLUp:		(isLVLUp: boolean)=>void,
	currExpInfo:	{
		level: 	number,
		exp:	number
	},
	setLvl: (level: number) => void
}

export function EditCalcPopupExp({header, onCancel, color, currExpInfo, onSave, onLVLUp}: EditCalcPopupCoinsProps) {
	const [inputValue, setInputValue] = useState('');
	const [tempResult, setTempResult] = useState(0);

	const calcExpBarWidth = (): number => {
		if (tempResult >= 0) {
			return (xpToNextLVL && currExpInfo.exp < xpToNextLVL) ? Math.round(currExpInfo.exp / xpToNextLVL * 100) : 100;
		} else {
			return (xpToNextLVL && currExpInfo.exp + tempResult > 0) ? Math.round((currExpInfo.exp + tempResult) / xpToNextLVL * 100) : 0;
		}
	};
	
	const xpToNextLVL = thatLevelLowBorder(currExpInfo.level+1);
	const expBarWidth = calcExpBarWidth();
	const tmpBarWidth = (xpToNextLVL && currExpInfo.exp+tempResult < xpToNextLVL) 
		? Math.round(Math.abs(tempResult) / xpToNextLVL * 100) 
		: 100 - expBarWidth;

	const onSuccessValidator = (val: number) => {
		setTempResult(val);
	};

	const fieldValidator = (inputValue: string) => {
		return validator(inputValue, onSuccessValidator);
	};

	return <EditCustomPopup 
		header={header} 
		onCancel={onCancel} 
		color={color} 
		wrapperCN={styles['exp-wrapper']}>
		<div className={styles['calculator-wrapper']}>
			<div className={styles['exp-bar-wrapper']}>
				<div className={styles['exp-bar-info']}>
					<div className={styles['current-exp-wrapper']}>
						<div className={styles['current']}>{currExpInfo.exp}</div>
						{tempResult !== 0 && 
							<div 
								className={cn(styles['current'], tempResult>0?styles['extra']:styles['remove'])}>
								{(tempResult>0?'+':'')+tempResult}
							</div>
						}
					</div>
					<div className={styles['current-exp-wrapper']}>
						<div className={styles['exp-to-next']}>{xpToNextLVL}</div>
					</div>
				</div>
				<div className={styles['progress-bar']}>
					<div 
						className={
							cn(
								styles['exp-bar'], 
								tmpBarWidth !== 0 ? styles['right-no-radius'] : ''
							)
						} 
						style={{width: expBarWidth+'%'}}></div>
					<div className={cn(styles['temp-exp-bar'], tempResult < 0 ? styles['temp-red']:'')} style={{width: tmpBarWidth+'%'}}></div>
				</div>
			</div>
			<CalcField
				inputValue={inputValue}
				setInputValue={setInputValue}	
				
				validator={fieldValidator}
				rightResultElem={
					<div className={styles['result-text']}>
						{tempResult}
					</div>
				}
			>
			</CalcField>
			<div className={cn(styles['calc'], styles['exp'])}>
				{['1','2','3','4','5','6','7','8','9','0'].map(calcNum => {
					return <CalcButton 
						onClickAction={()=>onClickNumberAction(calcNum, inputValue, onSuccessValidator, setInputValue)} 
						key={`calc-${calcNum}`}
						buttonCN={styles['exp-button']}
						width={1}>
						<div className={styles['button-content']}>
							{calcNum}
						</div>
					</CalcButton>;
				})}

				<CalcButton 
					onClickAction={()=>onClickOperatorAction('+', inputValue, setInputValue)} 
					key={'calc+'}
					buttonCN={cn(styles['operator-button'], styles['coins'])}
					width={1}>
					<img 
						src='/plus.svg' 
						className={
							cn(styles['button-content'], styles['button-operator'])}
					/>
				</CalcButton>
				<CalcButton 
					onClickAction={()=>onClickOperatorAction('-', inputValue, setInputValue)} 
					key={'calc-'}
					buttonCN={cn(styles['operator-button'],styles['coins'])}
					width={1}>
					<img 
						src='/minus.svg' 
						className={
							cn(styles['button-content'], styles['button-operator'])}
					/>
				</CalcButton>
				<CalcButton 
					onClickAction={()=>onClickOperatorAction('*', inputValue, setInputValue)} 
					key={'calc*'}
					buttonCN={cn(styles['operator-button'], styles['coins'])}
					width={1}>
					<img 
						src='/x.svg' 
						className={
							cn(styles['button-content'], styles['button-operator'])}
					/>
				</CalcButton>
				<CalcButton 
					buttonCN={styles['button-add']}
					onClickAction={()=>onClickAdd(inputValue, onSuccessValidator, onSave)} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>Прибавить</div>
				</CalcButton>
				<CalcButton 
					buttonCN={styles['button-remove']}
					onClickAction={()=>onClickRemove(inputValue, onSuccessValidator, onSave)} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>Отнять</div>
				</CalcButton>
				<div className={styles['button-extended']}>
					<CalcButton 
						buttonCN={styles['button-lvl-up']}
						onClickAction={()=>onLVLUp(true)} 
						width={1}>
						<div className={cn(styles['button-content'], currExpInfo.level === 20 ? styles['invisible'] : '')}>{'>>'}</div>
					</CalcButton>
					<div className={styles['button-label']}>LVL</div>
					<CalcButton 
						buttonCN={styles['button-lvl-down']}
						onClickAction={()=>onLVLUp(false)} 
						width={1}>
						<div className={cn(styles['button-content'], currExpInfo.level === 1 ? styles['invisible'] : '')}>{'>>'}</div>
					</CalcButton>
				</div>
			</div>
		</div>
	</EditCustomPopup>;
}