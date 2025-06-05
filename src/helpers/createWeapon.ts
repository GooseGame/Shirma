import { Weapon } from '../interfaces/Equipment.interface';
import { ATTRIBUTE_AMMUNITION, ATTRIBUTE_DISTANCE, ATTRIBUTE_HEAVY, ATTRIBUTE_HIDDEN, ATTRIBUTE_LIGHT, ATTRIBUTE_TWO_HANDED, DAMAGE_TYPE_FIRE, DAMAGE_TYPE_PIERCING, DAMAGE_TYPE_POISON } from './attributes';
import { randomHash } from './random';

export const weapons: Weapon[] = [
	{
		id:		randomHash(),
		isProf: false,
		isMelee: true,
		scaleStat: 'Ловкость',
		aimModifier: 0,
		name:	'Кинжал',
		count: 1,
		damage: [
			{
				value: {
					count: 1,
					edge: 6
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_PIERCING,
				dmg_id: randomHash()
			}
		],
		attributes: [
			{
				name: 'Лёгкое',
				id: ATTRIBUTE_LIGHT
			},
			{
				name: 'Скрытое',
				id: ATTRIBUTE_HIDDEN
			}
		]
	},
	{
		id:		randomHash(),
		isProf: true,
		scaleStat: 'Ловкость',
		aimModifier: 0,
		isMelee: false,
		name:	'Длинный лук',
		count: 1,
		damage: [
			{
				value: {
					count: 1,
					edge: 10
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_PIERCING,
				dmg_id: randomHash()
			},
			{
				value: {
					count: 1,
					edge: 4
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_POISON,
				dmg_id: randomHash()
			}
		],
		attributes: [
			{
				name: 'Тяжелое',
				id: ATTRIBUTE_HEAVY
			},
			{
				name: 'Двуручное',
				id: ATTRIBUTE_TWO_HANDED
			},
			{
				name: 'Боезапас',
				id: ATTRIBUTE_AMMUNITION
			},
			{
				name: 'Дистанция',
				id: ATTRIBUTE_DISTANCE,
				distance: 20,
				maxDistance: 120
			}
		]
	},
	{
		id:		randomHash(),
		isProf: true,
		scaleStat: 'Ловкость',
		aimModifier: 0,
		isMelee: false,
		name:	'Длинный лук',
		count: 1,
		damage: [
			{
				value: {
					count: 2,
					edge: 10
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_PIERCING,
				dmg_id: randomHash()
			},
			{
				value: {
					count: 1,
					edge: 4
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_POISON,
				dmg_id: randomHash()
			},
			{
				value: {
					count: 2,
					edge: 6
				},
				modifiers: 3,
				typeId: DAMAGE_TYPE_FIRE,
				dmg_id: randomHash()
			}
		],
		attributes: [
			{
				name: 'Тяжелое',
				id: ATTRIBUTE_HEAVY
			},
			{
				name: 'Двуручное',
				id: ATTRIBUTE_TWO_HANDED
			},
			{
				name: 'Боезапас',
				id: ATTRIBUTE_AMMUNITION
			},
			{
				name: 'Дистанция',
				id: ATTRIBUTE_DISTANCE,
				distance: 20,
				maxDistance: 120
			}
		]
	}
];