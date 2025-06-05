import { useState } from 'react';
import { CalcField } from '../CalcField/CalcField';
import styles from './EditCalcPopup.module.css';
import { EditCustomPopup } from '../EditCustomPopup/EditCustomPopup';
import { EditCalcPopupProps } from './EditCalcPopup.props';
import { CalcButton } from '../CalcButton/CalcButton';
import { onClickAddCoins, onClickNumberAction, onClickOperatorAction, onClickRemoveCoins, onClickSpecialConvertCoins, validator } from './EditCalcPopup.helpers';
import cn from 'classnames';
import { getGoldEquivalent, getSilverEquivalent, getCopperEquivalent } from '../../helpers/coins';

interface EditCalcPopupCoinsProps extends EditCalcPopupProps {
	onSaveCoins: (value: number, coinType: string)=>void
}

export function EditCalcPopupCoins({header, onCancel, color, onSaveCoins}: EditCalcPopupCoinsProps) {
	const [inputValue, setInputValue] = useState('');
	const [tempResult, setTempResult] = useState(0);
	const [coinType, setCoinType] = useState('gold');

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
		wrapperCN={styles['coins-wrapper']}>
		<div className={styles['calculator-wrapper']}>
			<CalcField
				validator={fieldValidator}
				inputValue={inputValue}
				setInputValue={setInputValue}	
				leftCustomElem={
					<select
						className={styles['select-coin']}
						value={coinType}
						onChange={e => setCoinType(e.target.value)}
					>
						<option value='gold'>Золото</option>
						<option value='silver'>Серебро</option>
						<option value='copper'>Медь</option>
					</select>
				}
				rightResultElem={
					<div className={styles['result-text']}>
						{tempResult}
					</div>
				}
			>

			</CalcField>
			<div className={cn(styles['calc'], styles['coins'])}>
				{['1','2','3','4','5','6','7','8','9','0'].map(calcNum => {
					return <CalcButton 
						onClickAction={()=>onClickNumberAction(calcNum, inputValue, onSuccessValidator, setInputValue)} 
						key={`calc-${calcNum}`}
						buttonCN={styles['coins-button']}
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
					onClickAction={()=>onClickAddCoins(inputValue, coinType, onSuccessValidator, onSaveCoins)} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>
				Прибавить
					</div>
				</CalcButton>
				<CalcButton 
					buttonCN={styles['button-remove']}
					onClickAction={()=>onClickRemoveCoins(inputValue, coinType, onSuccessValidator, onSaveCoins)} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>
				Отнять
					</div>
				</CalcButton>

				<div className={styles['special-coins']}>
					<CalcButton buttonCN={styles['gold']} width={3} onClickAction={() => setInputValue(onClickSpecialConvertCoins('gold', coinType, tempResult, setCoinType))}>
						<div className={styles['button-content']}>
							{getGoldEquivalent(coinType, tempResult)} зм
						</div>				
					</CalcButton>
					<CalcButton buttonCN={styles['silver']} width={3} onClickAction={() => setInputValue(onClickSpecialConvertCoins('silver', coinType, tempResult, setCoinType))}>
						<div className={styles['button-content']}>
							{getSilverEquivalent(coinType, tempResult)} см
						</div>				
					</CalcButton>
					<CalcButton buttonCN={styles['copper']} width={3} onClickAction={() => setInputValue(onClickSpecialConvertCoins('copper', coinType, tempResult, setCoinType))}>
						<div className={styles['button-content']}>
							{getCopperEquivalent(coinType, tempResult)} мм
						</div>				
					</CalcButton>
					<div className={styles['special-info']}>Другие монеты</div>
				</div>
			</div>
		</div>
	</EditCustomPopup>;
}