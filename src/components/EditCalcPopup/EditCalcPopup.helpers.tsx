import { Parser } from 'expr-eval';
import { getCopperEquivalent, getGoldEquivalent, getSilverEquivalent } from '../../helpers/coins';

export const validator = (inputValue: string, onSuccess: (val: number)=>void) => {
	inputValue.split(new RegExp('[+-/*]', 'g'));
	if (inputValue === '') {
		onSuccess(0);
		return true;
	}
	if (!new RegExp('^[\\d+\\-*\\s]+$').test(inputValue)) return false;
	try {
		const temp = Parser.evaluate(inputValue);
		onSuccess(temp);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const onClickNumberAction = (
	value: string, 
	inputValue: string, 
	onSuccess: (val: number)=>void,
	setInputValue: React.Dispatch<React.SetStateAction<string>>
) => {
	if (validator(inputValue+value, onSuccess)) {
		setInputValue(inputValue+value);
	}
};

export const onClickOperatorAction = (
	value: string,	
	inputValue: string, 
	setInputValue: React.Dispatch<React.SetStateAction<string>>
) => {
	setInputValue(inputValue+value);
};

export const onClickAddCoins = (
	inputValue: string, 
	coinType: string,
	onSuccess: (val: number)=>void,
	onSaveCoins: (val: number, coinType: string) => void
) => {
	if (inputValue==='') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			onSaveCoins(result, coinType);
		} catch (e) {
			console.log(e);
		}
	}
};

export const onClickAdd = (
	inputValue: string, 
	onSuccess: (val: number)=>void,
	onSave: (val: number)=>void
) => {
	if (inputValue==='') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			onSave(result);
		} catch (e) {
			console.log(e);
		}
	}
};

export const onClickRemoveCoins = (
	inputValue: string, 
	coinType: string,
	onSuccess: (val: number)=>void,
	onSaveCoins: (val: number, coinType: string) => void
) => {
	if (inputValue==='') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			onSaveCoins(-1*result, coinType);
		} catch (e) {
			console.log(e);
		}
	}
};

export const onClickRemove = (
	inputValue: string, 
	onSuccess: (val: number)=>void,
	onSave: (val: number)=>void
) => {
	if (inputValue==='') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			onSave(-1*result);
		} catch (e) {
			console.log(e);
		}
	}
};

export const onClickAddHealth = (
	inputValue: string, 
	changeHealth: (value: number, type: 'extra'|'default')=>void,
	onSuccess: (val: number)=>void,
	type: 'extra'|'default'
) => {
	if (inputValue === '') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			if (result <= 0 && type === 'extra') {
				return;
			}
			changeHealth(result, type);
		} catch (e) {
			console.log(e);
		}
	}
};

export const onClickRemoveHealth = (
	inputValue: string, 
	changeHealth: (value: number, type: 'extra'|'default')=>void,
	onSuccess: (val: number)=>void
) => {
	if (inputValue === '') return;
	if (validator(inputValue, onSuccess)) {
		try {
			const result = Parser.evaluate(inputValue);
			changeHealth(-1*result, 'default');
		} catch (e) {
			console.log(e);
		}
	}
};

export const allowConvertingCoins = (tempResult: number) => {
	return (tempResult > 0);	
};

export const onClickSpecialConvertCoins = (
	converTo: string, 
	coinType: string, 
	tempResult: number, 
	setCoinType: React.Dispatch<React.SetStateAction<string>>
) => {
	if (coinType !== 'gold' && coinType !== 'silver' && coinType !== 'copper') return '0';
	if (allowConvertingCoins(tempResult)) {
		let newValue = 0;
		switch (converTo) {
		case 'gold':
			newValue = getGoldEquivalent(coinType, tempResult);
			console.log(newValue);
			setCoinType('gold');
			break;
		case 'silver':
			newValue = getSilverEquivalent(coinType, tempResult);
			setCoinType('silver');
			break;
		case 'copper':
			newValue = getCopperEquivalent(coinType, tempResult);
			setCoinType('copper');
			break;
		default:
			return '0';
		}

		return newValue.toString();
	}
	return '0';
};