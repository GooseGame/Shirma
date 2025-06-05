import { Dice } from '../interfaces/Character.interface';

export function randomDiceValue(dice: Dice) {
	return Math.floor(Math.random()*(dice.edge-1) + 1);
}

export function randomHash() {
	return Math.random().toString(36).slice(2, 7);
}

export function splitDiceValueToDices(dice: Dice, value: number) {
	if (value > dice.count*dice.edge) return undefined;
	if (value < dice.count) return undefined;
	const midValue = Math.floor(value / dice.count);
	let leftovers = value - midValue * dice.count;
	const result = [];
	for (let j = 0; j < dice.count; j++) {
		let value = midValue;
		if (leftovers !== 0) {
			if (leftovers + midValue <= dice.edge) {
				value = leftovers + midValue;
				leftovers = 0;
			} else {
				value = dice.edge;
				leftovers = leftovers - (dice.edge - midValue);
			}
		}
		
		result.push(
			{
				count: 1,
				edge: dice.edge,
				value: value
			} as Dice
		);
	}
	return result;
}