 
import { RollBoxProps } from './RollBox.props';
import styles from './RollBox.module.css';
import cn from 'classnames';
import { DiceComponent } from '../DiceComponent/DiceComponent';
import { useEffect, useState } from 'react';
import { Dice } from '../../interfaces/Character.interface';
import { RoundButton } from '../Button/Button';
import { randomDiceValue, randomHash, splitDiceValueToDices } from '../../helpers/random';
import { associativeDamage, damageTypes, getDamageById } from '../../helpers/attributes';
import useScreenWidth from '../../helpers/hooks/useScreenWidth';

interface DicesInABox {
    id: number,
    dice: Dice,
	diceValue: number,
	typeId?: number,
	modifier?: number
}

const MAX_DICES_COUNT = 63;
const MAX_DICES_MOBILE = 25;
export const SLIDE_ANIMATION_TIME = 400;
export const ROLL_ANIMATION_TIME = 1200;
export const IDLE_TIME = 300;

export function RollBox({dicesSent = [], setPopup}: RollBoxProps) {

	const fillDiceBox = (): DicesInABox[] => {
		if (!isAutoMode) return [];
		const result: DicesInABox[] = [];
		dicesSent.map((dice, i) => {
			if (dice.value.count > 0) {
				if (dice.value.value && dice.value.count > 1) {
					const preDefinedDices = splitDiceValueToDices(dice.value, dice.value.value);
					if (preDefinedDices) {
						preDefinedDices.map((preDefinedDice, j) => {
							result.push({
								id: 1000*i + j,
								dice: preDefinedDice,
								diceValue: dice.value.edge,
								typeId: dice.typeId,
								modifier: (j === 0 ? dice.modifiers: 0)
							} as DicesInABox);
						});
					}
				} else {
					for (let j = 0; j < dice.value.count; j++) {
						result.push({
							id: 1000*i + j,
							dice: {
								count: 1,
								edge:  dice.value.edge,
								value: dice.value.value
							},
							diceValue: dice.value.edge,
							typeId: dice.typeId,
							modifier: (j === 0 ? dice.modifiers: 0)
						} as DicesInABox);
					}
				}
			}
		});
		return result;
	};

	const isAutoMode = dicesSent.length > 0;
	const dicesProps = isAutoMode ? fillDiceBox() : [];
	const [dicesInABox, setDicesInABox] = useState<DicesInABox[]>(dicesProps);
	const [isOpen, setIsOpen] = useState(isAutoMode);
	const [animate, setAnimate] = useState(isAutoMode);
	const [hideRight, setHideRight] = useState<'hide-right'|'show-right'|'START'>(!isAutoMode ? 'START' : 'show-right');
	let allDicesValue = 0;
	const associativeDamage: associativeDamage = [];
	const screenWidth = useScreenWidth();

	//автомод
	useEffect(()=> {
		if (isAutoMode) {
			if (hideRight === 'START' || hideRight === 'hide-right') {
				setHideRight('show-right');
			}
			setDicesInABox(fillDiceBox());
			setTimeout(() => {
				setAnimate(true);
			}, SLIDE_ANIMATION_TIME);
			setTimeout(()=>{
				if (isOpen) setIsOpen(false);
				setHideRight('hide-right');
			}, ROLL_ANIMATION_TIME + SLIDE_ANIMATION_TIME + IDLE_TIME);
			setTimeout(()=>{
				setHideRight('START');
			}, ROLL_ANIMATION_TIME + SLIDE_ANIMATION_TIME + SLIDE_ANIMATION_TIME + IDLE_TIME);
		}
	},[isAutoMode]);


	//анимация броска
	useEffect(() => {
		if (animate) {		
			setTimeout(() => {
				setDicesInABox(dicesInABox.map(el => {
					const diceValue = el.dice.value ? el.dice.value : randomDiceValue(el.dice);
					const modifier = el.modifier ? el.modifier : 0;
					if (el.typeId && damageTypes.includes(el.typeId)) {
						associativeDamage[el.typeId] = associativeDamage[el.typeId] ? (associativeDamage[el.typeId] + diceValue + modifier) : diceValue + modifier;
					}
					el.diceValue = diceValue;
					allDicesValue += (diceValue+modifier);
					return el;
				}));	
				if (setPopup && allDicesValue !== 0) {
					console.log(allDicesValue);
					setPopup({
						header: 'Результат броска:',
						text: getPopupText(),
						isShow: true,
						popupid: randomHash()
					});
				}
				setAnimate(false);
			}, ROLL_ANIMATION_TIME);
		}
	}, [animate]);

	const isMobile = () => {
		return screenWidth < 600;
	};

	const addDiceToBox = (dice: Dice) => {
		if (dicesInABox.length === MAX_DICES_COUNT) return; 
		if (isMobile() && dicesInABox.length === MAX_DICES_MOBILE) return;
		const newDice = {
			id: dicesInABox.length,
			dice: dice,
			diceValue: dice.edge
		};
		setDicesInABox([...dicesInABox, newDice]);
	};

	const removeDice = (id: number) => {
		if (isAutoMode) return;
		setDicesInABox([...dicesInABox.filter((dice) => dice.id !== id)]);
	};

	const clearBox = () => {
		setDicesInABox([]);
	};

	const handleAnimateButton = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!animate) {
			setAnimate(true);
		}
	};

	const getPopupText = () => {
		let popupText = `В сумме ${allDicesValue}:`;
		for (const key in associativeDamage) {
			const damageType = getDamageById(parseInt(key));
			popupText += damageType ? ` (${associativeDamage[key]} - ${damageType.name}),` : '';
		}
		console.log(popupText);
		return popupText.substring(0, popupText.length - 1);
	};

	const getSizeOfABox = () => {
		if (dicesInABox.length <= 3) return 'size3x1';
		if (dicesInABox.length <= 9) return 'size3x3';
		if (dicesInABox.length <= 16) return 'size4x4';
		if (dicesInABox.length <= 25) return 'size5x5';
		if (dicesInABox.length <= 36) return 'size6x6';
		if (dicesInABox.length <= 49) return 'size7x7';
		if (dicesInABox.length <= 64) return 'size8x8';
		return '8x8';
	};

	const handleRollButton = () => {
		clearBox();
		if (!isOpen) setIsOpen(true);
		else setIsOpen(false);
		if (hideRight === 'START' || hideRight === 'hide-right') {
			setHideRight('show-right');
		} else {
			setHideRight('hide-right');
			setTimeout(() => {
				setHideRight('START');
			}, SLIDE_ANIMATION_TIME);
		}		
	};
    
	return <div className={cn(styles['box-wrapper'], animate ? styles['open'] : '')}>
		{!isAutoMode && <div className={cn(styles['left-buttons'], styles[hideRight])}>
			<RoundButton onClick={handleRollButton} classNames={cn(styles['open-button'], styles['brown'])}>
				{!isOpen && <img className={styles['open-close']} src='/d20.svg'/>}
				{isOpen && <img className={styles['open-close']} src='/x.svg'/>}
			</RoundButton>
			{isOpen && 
			<RoundButton onClick={()=>clearBox()} classNames={cn(styles['open-button'], styles['brown'])}>
				<img src='/reload-white.svg' className={styles['open-close']}/>
			</RoundButton>}
			{(isOpen && !animate) && 
			<RoundButton onClick={handleAnimateButton} classNames={styles['open-button']} isRed>Ролл</RoundButton>}
		</div>}
		<div className={cn(styles['right'], styles[hideRight])}>
			<div className={cn(styles['box'], styles[getSizeOfABox()], animate ? styles['animate'] : '')}>
				{dicesInABox.map(dice => (
					<DiceComponent key={dice.id} classNames={cn(styles['dice-add'], styles['dice-roll'], animate ? styles['animate'] : '')} animate={animate} onClick={()=>removeDice(dice.id)} dice={dice.dice} diceValue={dice.diceValue}/>
				))}
			</div>
			{!isAutoMode && 
			<div className={styles['dices-to-add']}>
				<DiceComponent classNames={styles['dice-add']} onClick={()=>addDiceToBox({count: 1, edge: 20})} dice={{count: 1, edge: 20}} diceValue={20}/>
				<DiceComponent classNames={styles['dice-add']} onClick={()=>addDiceToBox({count: 1, edge: 12})} dice={{count: 1, edge: 12}} diceValue={12}/>
				<DiceComponent classNames={styles['dice-add']} onClick={()=>addDiceToBox({count: 1, edge: 10})} dice={{count: 1, edge: 10}} diceValue={10}/>
				<DiceComponent classNames={styles['dice-add']} onClick={()=>addDiceToBox({count: 1, edge: 8})} dice={{count: 1, edge: 8}} diceValue={8}/>
				<DiceComponent classNames={cn(styles['dice-add'])} onClick={()=>addDiceToBox({count: 1, edge: 6})} dice={{count: 1, edge: 6}} diceValue={6}/>
				<DiceComponent classNames={styles['dice-add']} onClick={()=>addDiceToBox({count: 1, edge: 4})} dice={{count: 1, edge: 4}} diceValue={4}/>
			</div>
			}
		</div>
	</div>;
}
