import { Character } from '../interfaces/Character.interface';
import { spellCellsDefault } from '../interfaces/spells.interface';
import { CHAR_KEY, CharState } from '../store/slices/Characters.slice';
import { loadState } from '../store/storage';
import { spells } from './createSpell';
import { weapons } from './createWeapon';
import { randomHash } from './random';
import { v4 as uuidv4 } from 'uuid';

export const getCharacterFromLocalStorage = (id: string) => {
	const chars = loadState<CharState>(CHAR_KEY);
	if (chars) {
		return chars.characters.find(ch => ch.id === id);
	}
	return undefined;
};

export const getClassByClassname = (className: string) => {
	switch (className.toLowerCase().trim()) {
	case 'монах':
	case 'монахиня':
	case 'монашка':
		return 'monk';
	case 'варвар':
		return 'barbarian';
	case 'паладин':
		return 'paladin';
	case 'бард':
	case 'бардесса':
		return 'bard';
	case 'жрец':
	case 'жрица':
	case 'клирик':
		return 'cleric';
	case 'друид':
		return 'druid';
	case 'воин':
		return 'fighter';
	case 'следопыт':
	case 'следопытка':
		return 'ranger';
	case 'плут':
	case 'рога':
		return 'rogue';
	case 'чародей':
	case 'чародейка':
		return 'sorcerer';
	case 'колдун':
		return 'warlock';
	case 'изобретатель':
	case 'изобретательница':
		return 'artificer';
	case 'волшебник':
	case 'волшебница':
		return 'wisard';
	default:
		return 'default';
	}
};

const tmpName = 'Новый персонаж';
const noImage = 'https://lss-s3-files.s3.eu-north-1.amazonaws.com/avatar/63ca52ca66f793d3361e13f9.jpeg?mod=1725048119529';
const initialCharacter: Character = {
	id: randomHash(),
	avatar: noImage,
	info: {
		name: tmpName,
		level: 1,
		exp: 0,
		class: {name: 'Монах'},
		alignment: {
			name: 'Хаотично-Нейтральный',
			coordinates: {
				x: 75,
				y: 50
			}
		},
		alignmentShort: 'Х-Н',
		backgroundTitle: 'Преступник',
		race: 'Табакси',
		text: {
			background: {
				type: 'text',
				text: []
			},
			features: {
				type: 'text',
				text: []
			},
			notes: [],
			traits: {
				type: 'text',
				text: []
			},
			prof: {
				type: 'text',
				text: []
			},
			quests: {
				type: 'text',
				text: []
			},
			ideals: {
				type: 'text',
				text: []
			},
			weaknesses: {
				type: 'text',
				text: []
			},
			affections: {
				type: 'text',
				text: []
			},
			allies: {
				type: 'text',
				text: []
			},
			possession: [
				{
					category: 'Доспехи',
					categoryId: uuidv4(),
					items: [
					]
				},
				{
					category: 'Оружие',
					categoryId: uuidv4(),
					items: []
				},
				{
					category: 'Инструменты',
					categoryId: uuidv4(),
					items: []
				}
			]
		},
		measurements: {
			age: '16',
			eyes: 'Карие',
			hair: 'Рыжеватые',
			skin: 'Под шерстью',
			height: '180',
			weight: '80'
		}
	},
	stats: [
		{
			name: 'Телосложение',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: []
		},
		{
			name: 'Интелект',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: [
				{
					name: 'Анализ',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'История',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Магия',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Природа',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Религия',
					profLevel: 0,
					modifier: 0
				}
			]
		},
		{
			name: 'Харизма',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: [
				{
					name: 'Выступление',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Запугивание',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Обман',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Убеждение',
					profLevel: 0,
					modifier: 0
				}
			]
		},
		{
			name: 'Ловкость',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: [
				{
					name: 'Акробатика',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Ловкость рук',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Скрытность',
					profLevel: 0,
					modifier: 0
				}
			]
		},
		{
			name: 'Мудрость',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: [
				{
					name: 'Внимание',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Выживание',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Медицина',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Проницательность',
					profLevel: 0,
					modifier: 0
				},
				{
					name: 'Уход за животными',
					profLevel: 0,
					modifier: 0
				}
			]
		},
		{
			name: 'Сила',
			score: 10,
			modifier: 0,
			saveProf: 0,
			skills: [
				{
					name: 'Атлетика',
					profLevel: 0,
					modifier: 0
				}
			]
		}
	],
	proficiency: 2,
	backpack: {
		equipment: [],
		coins: {
			gold: 0,
			silver: 0,
			copper: 0,
			total: 0
		},
		weapons: weapons,
		treasure: [],
		quest: []
	},
	condition: {
		health: {
			current: 1,
			max: 1,
			extra: 0,
			isDying: false,
			stabilization: {
				success: 0,
				fail: 0
			},
			hpDice: {
				count: 1,
				edge: 8
			}
		},
		armor: 10,
		speed: 30,
		inspiration: false,
		exhaustionLvl: 0,
		statuses: [
			
		],
		initiative: 0
	},
	spells: {
		cells: spellCellsDefault,
		spellsStat: 'Харизма',
		saveRoll:	10,
		modifier:	0,
		spells:		spells
	}
};

export function createCharacter(): Character {
	return initialCharacter;
}