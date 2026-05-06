import { randomHash } from './random';
import { Monster } from '../interfaces/Monster.interface';
import { Text } from '../interfaces/Text.interface';

const emptyText: Text = {
	type: 'text',
	text: []
};

export function createMonster(): Monster {
	return {
		id: randomHash(),
		name: 'Новый монстр',
		description: emptyText,
		avatar: '/default-user.svg',
		size: [],
		type: {
			id: 'beast',
			name: 'Зверь'
		},
		alignment: {
			name: 'Нейтральный',
			coordinates: { x: 50, y: 50 }
		},
		alignmentShort: 'Н-Н',
		armor: 10,
		hp: {
			recommended: 1,
			generated: {
				dice: { count: 1, edge: 4 },
				extra: 0
			}
		},
		speed: { base: 30 },
		stats: [],
		proficiency: 2,
		resistances: [],
		vulnerabilities: [],
		immune: [],
		senses: {
			passivePerception: 10
		},
		languages: [],
		danger: {
			challengeRating: 1,
			xp: 0
		},
		specialAbilities: {
			spells: [],
			actions: []
		},
		actions: [],
		reactions: [],
		legendaryActions: [],
		spells: [],
		cells: [],
		livingAreas: []
	};
}
