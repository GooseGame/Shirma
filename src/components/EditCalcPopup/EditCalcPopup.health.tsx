import { EditCalcPopupProps } from './EditCalcPopup.props';
import { CalcField } from '../CalcField/CalcField';
import styles from './EditCalcPopup.module.css';
import { EditCustomPopup } from '../EditCustomPopup/EditCustomPopup';
import { CalcButton } from '../CalcButton/CalcButton';
import { onClickAddHealth, onClickNumberAction, onClickOperatorAction, onClickRemoveHealth, validator } from './EditCalcPopup.helpers';
import cn from 'classnames';
import { useState } from 'react';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import { Dice } from '../../interfaces/Character.interface';
import { randomDiceValue } from '../../helpers/random';
import { SquareButton } from '../Button/Button';

interface EditCalcPopupHealthProps extends EditCalcPopupProps {
	changeHealth: 		(value: number, type: 'extra'|'default')=>void,
	onClickStabilize:	(stabilisationValue?: number, mode?: 'success' | 'fail') => void,
	currHealthInfo:	{
		current: 		number,
		extra:			number,
		max:			number,
		isDying:		boolean,
		stabilization: {
			success: 	0|1|2|3,
			fail: 		0|1|2|3
		},
		hpDiceEdge: number
	},
	setDiceRoll?: React.Dispatch<React.SetStateAction<Damage[] | DiceCheck[]>>,
	changeMaxHP: (newValue: number) => void,
	changeHPDice: (value: number) => void,
}

export function EditCalcPopupHealth({header, onCancel, setPopup, color, changeHealth, onClickStabilize, currHealthInfo, setDiceRoll, changeMaxHP, changeHPDice}: EditCalcPopupHealthProps) {
	const [inputValue, setInputValue] = useState('');
	const [tempResult, setTempResult] = useState(0);
	const [isSettingsOpened, setSettingsOpened] = useState(false);
	const [maxHp, setMaxHp] = useState(currHealthInfo.max);
	const [hpDiceEdge, setHpDiceEdge] = useState(currHealthInfo.hpDiceEdge);

	const calcHealthBarWidth = (): number => {
		if (tempResult >= 0) {
			return (currHealthInfo.current < maxHeath) ? Math.round((currHealthInfo.current) / (maxHeath+extra) * 100) : 100;
		} else {
			return (currHealthInfo.current + extra + tempResult > 0) 
				? (extra+tempResult > 0) 
					? Math.round((currHealthInfo.current) / (maxHeath+extra) * 100)
					: Math.round((currHealthInfo.current + extra + tempResult) / (maxHeath+extra) * 100) : 0;
		}
	};

	const calcExtraBarWidth = (): number => {
		if (tempResult >= 0) {
			if (currHealthInfo.current+extra < (maxHeath+extra)) {
				return Math.round(extra / (maxHeath+extra)*100);
			} else {
				100 - healBarWidth;
			}
		} else {
			if (extra+tempResult >= 0) {
				return Math.round((extra+tempResult) / (maxHeath+extra)*100);
			} else {
				return 0;
			}
		}
		return 0;
	};
	
	const maxHeath = currHealthInfo.max;
	const extra = currHealthInfo.extra;
	const healBarWidth = calcHealthBarWidth();
	const extraHealthWidth = calcExtraBarWidth();
	const tmpBarWidth = (currHealthInfo.current+extra+tempResult < (maxHeath+extra)) 
		? Math.round(Math.abs(tempResult) / (maxHeath+extra) * 100) 
		: 100 - healBarWidth - extraHealthWidth;

	const onSuccessValidator = (val: number) => {
		setTempResult(val);
	};

	const fieldValidator = (inputValue: string) => {
		return validator(inputValue, onSuccessValidator);
	};

	const onClickHealthPotion = (healDice: Dice, modifier: number) => {
		const splittedDice: DiceCheck[] = [];
		let resultValue = '';
		for (let i = 0; i < healDice.count; i++) {
			const currDiceValue = randomDiceValue(healDice);
			splittedDice.push(
				{
					value: {
						...healDice, 
						count: 1,
						value: currDiceValue
					},
					modifiers: 0,
					typeId: 0
				}
			);
			resultValue += `+${currDiceValue}`;
		}
		resultValue += `+${modifier}`;
		if (setDiceRoll) setDiceRoll(splittedDice);
		onClickNumberAction(resultValue, inputValue, onSuccessValidator, setInputValue);
	};

	const onChangeMaxHp = (value: string) => {
		const intVal = parseInt(value);
		if (intVal > 0 && intVal < 999) {
			setMaxHp(intVal);
			if (Math.abs(intVal - currHealthInfo.max) !== 1) {
				setPopup(currHealthInfo.max + ' -> '+intVal,'Изменено максимальное здоровье:');
			}
		}
	};

	const onChangeHPDice = (value: string) => {
		const intVal = parseInt(value);
		setHpDiceEdge(intVal);
		setPopup(currHealthInfo.hpDiceEdge + ' -> '+intVal,'Изменена кость хитов:');
	};

	return <EditCustomPopup 
		header={header} 
		onCancel={onCancel} 
		color={color} 
		wrapperCN={styles['exp-wrapper']}>
		<div className={styles['calculator-wrapper']}>
			<div className={styles['top-info']}>
				{currHealthInfo.isDying && currHealthInfo.stabilization.fail === 3 &&
					<div className={cn(styles['stab-wrapper'], styles['dead'])}>
						<img src='/dead.svg' alt='umer'/>
						<div className={styles['dead-text']}>Умер</div>
					</div>
				}
				{!(currHealthInfo.isDying && currHealthInfo.stabilization.fail === 3) &&
				<div className={styles['top-info-calc']}>
					<div className={styles['exp-bar-wrapper']}>
						<div className={styles['exp-bar-info']}>
							<div className={styles['current-exp-wrapper']}>
								<div className={styles['current']}>{currHealthInfo.current}</div>
								{currHealthInfo.extra > 0 && 
								<div 
									className={cn(styles['current'], styles['extra'])}>
									+{currHealthInfo.extra} Временных ОЗ
								</div>}
								{tempResult !== 0 && 
									<div 
										className={cn(styles['current'], tempResult>0?styles['heal']:styles['remove'])}>
										{(tempResult>0?'+':'')+tempResult}
									</div>
								}
							</div>
							<div className={styles['current-exp-wrapper']}>
								<div className={styles['exp-to-next']}>{maxHeath}</div>
							</div>
						</div>
						<div className={cn(styles['progress-bar'], styles['heal'])}>
							<div 
								className={
									cn(
										styles['exp-bar'], 
										styles['heal'],
										tmpBarWidth !== 0 || extraHealthWidth !== 0 ? styles['right-no-radius'] : ''
									)
								} 
								style={{width: healBarWidth+'%'}}>
							</div>
							<div 
								className={
									cn(
										styles['temp-exp-bar'], 
										tmpBarWidth !== 0 ? styles['right-no-radius'] : ''
									)
								} 
								style={{width: extraHealthWidth+'%'}}>
							</div>
							<div className={cn(styles['temp-exp-bar'], tempResult < 0 ? styles['temp-red']:styles['heal'])} style={{width: tmpBarWidth+'%'}}></div>
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
				</div>}
				{currHealthInfo.isDying && 
				<div className={styles['stab-wrapper']}>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.fail === 3 ? 2 : 3, 'fail')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-minus'],
								currHealthInfo.stabilization.fail >= 3 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.fail >= 3 ? 
							<img src='/non-saint.svg' alt='-3'/> : 
							<div></div>}
					</SquareButton>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.fail === 2 ? 1 : 2, 'fail')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-minus'],
								currHealthInfo.stabilization.fail >= 2 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.fail >= 2 ? 
							<img src='/non-saint.svg' alt='-2'/> : 
							<div></div>}
					</SquareButton>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.fail === 1 ? 0 : 1, 'fail')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-minus'],
								currHealthInfo.stabilization.fail >= 1 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.fail >= 1 ? 
							<img src='/non-saint.svg' alt='-1'/> : 
							<div></div>}
					</SquareButton>
					<SquareButton isBigShadow={false} onClick={()=>onClickStabilize()} classNames={styles['roll-btn']}>
						<img src='/d20.svg' alt='roll'/>
					</SquareButton>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.success === 1 ? 0 : 1, 'success')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-plus'],
								currHealthInfo.stabilization.success >= 1 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.success >= 1 ? 
							<img src='/saint.svg' alt='+1'/> : 
							<div></div>}
					</SquareButton>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.success === 2 ? 1 : 2, 'success')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-plus'],
								currHealthInfo.stabilization.success >= 2 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.success >= 2 ? 
							<img src='/saint.svg' alt='+2'/> : 
							<div></div>}
					</SquareButton>
					<SquareButton 
						isBigShadow={false}
						onClick={()=>onClickStabilize(currHealthInfo.stabilization.success === 3 ? 2 : 3, 'success')}
						classNames={
							cn(styles['button-stab'], 
								styles['stab-plus'],
								currHealthInfo.stabilization.success >= 3 ? styles['active']: styles['inactive'])
						}>
						{currHealthInfo.stabilization.success === 3 ? 
							<img src='/saint.svg' alt='+3'/> : 
							<div></div>}
					</SquareButton>
				</div>}
			</div>
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
					onClickAction={()=>{onClickAddHealth(inputValue, changeHealth, onSuccessValidator, 'default');}} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>Прибавить</div>
				</CalcButton>
				<CalcButton 
					buttonCN={styles['button-remove']}
					onClickAction={()=>{onClickRemoveHealth(inputValue, changeHealth, onSuccessValidator);}} 
					width={2}>
					<div className={cn(styles['button-content'], inputValue === '' ? styles['disabled'] : '')}>Отнять</div>
				</CalcButton>
				<CalcButton 
					buttonCN={styles['button-extra']}
					onClickAction={()=>{onClickAddHealth(inputValue, changeHealth, onSuccessValidator, 'extra');}} 
					width={3}>
					<div className={cn(styles['button-content'], (inputValue === '' || tempResult <= 0) ? styles['invisible'] : '')}>+{tempResult} Временных ОЗ</div>
				</CalcButton>
				<div className={styles['special-coins']}>
					<CalcButton 
						buttonCN={styles['button-heal']}
						onClickAction={()=>{onClickHealthPotion({count: 2, edge: 4}, 2);}} 
						width={2}>
						<div className={cn(styles['button-content'])}>
							<div className={styles['icon']}><img src='/healSmall.svg' alt='small'/></div>
							<div className={cn(styles['button-content'])}>2к4+2</div>
						</div>
					</CalcButton>
					<CalcButton 
						buttonCN={styles['button-heal']}
						onClickAction={()=>{onClickHealthPotion({count: 4, edge: 4}, 4);}} 
						width={2}>
						<div className={cn(styles['button-content'])}>
							<div className={styles['icon']}><img src='/healStandart.svg' alt='small'/></div>
							<div className={cn(styles['button-content'])}>4к4+4</div>
						</div>
					</CalcButton><CalcButton 
						buttonCN={styles['button-heal']}
						onClickAction={()=>{onClickHealthPotion({count: 8, edge: 4}, 8);}} 
						width={2}>
						<div className={cn(styles['button-content'])}>
							<div className={styles['icon']}><img src='/healBig.svg' alt='small'/></div>
							<div className={cn(styles['button-content'])}>8к4+8</div>
						</div>
					</CalcButton><CalcButton 
						buttonCN={styles['button-heal']}
						onClickAction={()=>{onClickHealthPotion({count: 20, edge: 4} as Dice, 20);}} 
						width={2}>
						<div className={cn(styles['button-content'])}>
							<div className={styles['icon']}><img src='/healGiant.svg' alt='small'/></div>
							<div className={cn(styles['button-content'])}>10к4+20</div>
						</div>
					</CalcButton>
					<CalcButton 
						buttonCN={cn(styles['button-settings'], isSettingsOpened ? styles['opened']:'')}
						onClickAction={()=>{setSettingsOpened(!isSettingsOpened);}} 
						width={2}>
						<div className={cn(styles['button-content'])}>
							<div className={styles['icon-smaller']}><img src={isSettingsOpened ? '/settings.svg' : '/settings-gray.svg'} alt='settings'/></div>
						</div>
					</CalcButton>
				</div>
				{isSettingsOpened && 
				<div className={styles['special-coins']}>
					<div className={styles['special-info']}>Макс ОЗ</div>
					<CalcButton 
						onClickAction={()=>{}} 
						width={3}>
						<div className={cn(styles['button-input'])}>
							<input type='number' value={maxHp} className={styles['hp-input']} onChange={(e)=>{onChangeMaxHp(e.target.value);}}/>
							<div className={cn(styles['apply-hp'], 'small-shadow')} onClick={()=>{if (maxHp !== maxHeath) {changeMaxHP(maxHp);}}}>
								<img src='/more.svg' className={cn(maxHp === maxHeath ? styles['invisible']:'', styles['apply-icon'])} alt='apply'/>
							</div>
						</div>
					</CalcButton>
					<div className={cn(styles['special-info'], styles['to-right'])}>Кость Хитов</div>
					<CalcButton 
						onClickAction={()=>{}} 
						width={3}>
						<div className={cn(styles['button-input'])}>
							<select value={hpDiceEdge} className={styles['hp-input']} onChange={(e)=>{onChangeHPDice(e.target.value);}}>
								<option value={'2'}>2</option>
								<option value={'4'}>4</option>
								<option value={'6'}>6</option>
								<option value={'8'}>8</option>
								<option value={'10'}>10</option>
								<option value={'12'}>12</option>
								<option value={'20'}>20</option>
							</select>
							<div className={cn(styles['apply-hp'], 'small-shadow')} onClick={()=>{if (hpDiceEdge !== currHealthInfo.hpDiceEdge) {changeHPDice(hpDiceEdge);}}}>
								<img src='/more.svg' className={cn(hpDiceEdge === currHealthInfo.hpDiceEdge ? styles['invisible']:'', styles['apply-icon'])} alt='apply'/>
							</div>
						</div>
					</CalcButton>
				</div>			
				}
			</div>
		</div>
		<button className={cn(styles['save-btn'], styles['fake-save'])}
			onClick={onCancel}
		><img src='/more-white.svg' alt='save' className={styles['save-img']}/></button>
	</EditCustomPopup>;
}