import { Coins } from '../interfaces/Character.interface';

export const SILVER_TO_GOLD_RELATION = 0.1;
export const COPPER_TO_GOLD_RELATION = 0.01;

export const calcTotal = (coins: Coins) => {
	return coins.gold + coins.silver * SILVER_TO_GOLD_RELATION + coins.copper * COPPER_TO_GOLD_RELATION;
};

export const getGoldEquivalent = (coinType: string, value: number) => {
	if (coinType === 'gold') return value;
	if (coinType === 'silver') return Math.floor(value * SILVER_TO_GOLD_RELATION);
	return Math.floor(value * COPPER_TO_GOLD_RELATION);
};

export const getSilverEquivalent = (coinType: string, value: number) => {
	if (coinType === 'silver') return value;
	if (coinType === 'copper') return Math.floor(value * SILVER_TO_GOLD_RELATION);
	return Math.floor(value / SILVER_TO_GOLD_RELATION);
};

export const getCopperEquivalent = (coinType: string, value: number) => {
	if (coinType === 'copper') return value;
	if (coinType === 'silver') return Math.floor(value / SILVER_TO_GOLD_RELATION);
	return Math.floor(value / COPPER_TO_GOLD_RELATION);
};

export const removeCoins = (coinType: 'gold'|'silver'|'copper', value: number, chCoins: Coins) => {
	let resultCoins = chCoins;

	if (chCoins[coinType] - value >= 0) { //если нам хватает без конвертации
		resultCoins = { ...chCoins, [coinType]: chCoins[coinType] - value };
	} else {
		const goldValue = getGoldEquivalent(coinType, value); //пересчитываем стоимость в золото
		if (chCoins.total - goldValue >= 0) { //если хватает на покупку
			if (coinType === 'gold') {
				const goldPlusSilverRemains = (chCoins.gold + chCoins.silver*SILVER_TO_GOLD_RELATION) - goldValue; //добавляем серебро персонажа для пересчёта
				if (goldPlusSilverRemains >= 0) {
					resultCoins = {...chCoins, gold: 0, silver: goldPlusSilverRemains/SILVER_TO_GOLD_RELATION} as Coins; 
				} else {
					const allCoins = (chCoins.gold + chCoins.silver*SILVER_TO_GOLD_RELATION + chCoins.copper*COPPER_TO_GOLD_RELATION) - goldValue; //добавляем медяки
					resultCoins = {...chCoins, gold: 0, silver: 0, copper: allCoins/COPPER_TO_GOLD_RELATION} as Coins;
				}
			} else if (coinType === 'silver') {
				const goldPlusSilverRemains = (chCoins.gold + chCoins.silver*SILVER_TO_GOLD_RELATION) - goldValue; //добавляем золото персонажа для пересчёта
				if (goldPlusSilverRemains >= 0) {
					const goldAmount = Math.floor(goldPlusSilverRemains);
					resultCoins = {...chCoins, gold: goldAmount, silver: (goldPlusSilverRemains - goldAmount)/SILVER_TO_GOLD_RELATION};
				} else {
					const allCoins = (chCoins.gold + chCoins.silver*SILVER_TO_GOLD_RELATION + chCoins.copper*COPPER_TO_GOLD_RELATION) - goldValue;
					resultCoins = {...chCoins, gold: 0, silver: 0, copper: allCoins/COPPER_TO_GOLD_RELATION};
				}
			} else {
				const copperPlusSilverRemains = (chCoins.copper*COPPER_TO_GOLD_RELATION + chCoins.silver*SILVER_TO_GOLD_RELATION) - goldValue;
				if (copperPlusSilverRemains >= 0) {
					const silverAmount = Math.floor(copperPlusSilverRemains/SILVER_TO_GOLD_RELATION);
					resultCoins = {...chCoins, silver: silverAmount, copper: (copperPlusSilverRemains-silverAmount)/copperPlusSilverRemains};
				} else {
					const allCoins = (chCoins.gold + chCoins.silver*SILVER_TO_GOLD_RELATION + chCoins.copper*COPPER_TO_GOLD_RELATION) - goldValue;
					const goldAmount = Math.floor(allCoins);
					const silverAmount = Math.floor((allCoins-goldAmount)/SILVER_TO_GOLD_RELATION);
					resultCoins = {...chCoins, gold: goldAmount, silver: silverAmount, copper: (allCoins-(goldAmount+silverAmount*SILVER_TO_GOLD_RELATION))/COPPER_TO_GOLD_RELATION};
				}
			}
		} else resultCoins = {...chCoins, gold: 0, silver: 0, copper: 0};
	}
	resultCoins.total = calcTotal(resultCoins);
	return resultCoins;
};