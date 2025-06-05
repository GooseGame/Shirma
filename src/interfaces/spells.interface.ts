import { Damage } from './Equipment.interface';
import { CharacterClass } from './Character.interface';
import { Text } from './Text.interface';

export const MAX_CELL_LEVEL = 8;
export const spellCellsDefault = [
	{
		count: 4,
		availible: 5
	},
	{
		count: 3,
		availible: 0
	},
	{
		count: 3,
		availible: 0
	},
	{
		count: 3,
		availible: 0
	},
	{
		count: 3,
		availible: 0
	},
	{
		count: 2,
		availible: 0
	},
	{
		count: 2,
		availible: 0
	},
	{
		count: 1,
		availible: 0
	}
];

export interface Spell {
	name: 			string,
	distance: 		string,
	duration: 		string,
	castTime: 		string,
	id: 			string,
	description:	Text,
	components:		SpellComponet[],
	availibleFor:	CharacterClass[],
	level:			number,
	concentration:	boolean,
	aim:			boolean,
	damageRoll?:	Damage[]
}

export interface SpellComponet {
	fullName: 		string,
	shortLetter: 	string,
	extra?:			string
}