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
		exp: 200,
		class: {name: 'Монах', subclass: 'Путь открытой ладони'},
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
				text: [
					{
						paragraph: [{
							type: 'word',
							word: 'Борис был рожден в бурных и беспокойных улицах большого города. В детстве его пленила жизнь уличного грабежа и уличных соревнований, где навыки и храбрость ценились выше всего. Хотя он не был мастером кражи, его талант в быстрых и бесшумных действиях позволил ему стать известным за свои способности в уличных схватках и грабежах.',
							style: 'normal'
						}]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Борис пользовался своими ',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'физическими данными',
								style: 'bold'
							},
							{
								type: 'word',
								word: ', чтобы зарабатывать на жизнь в темных закоулках города. Он участвовал в схватках, которые собирали толпы зрителей, и был известен своим искусством избегать захвата. Однако после одной особенно рискованной операции, когда ему едва удалось избежать ареста, он оказался в сложной ситуации, где его жизнь была под угрозой.',
								style: 'normal'
							}
						]
					},
					{
						paragraph: [{
							type: 'word',
							word: 'В этот момент ему повстречался странствующий мастер боевых искусств, который увидел в Борисе потенциал для большего, чем просто уличная жизнь. Он предложил ему шанс уйти от прежних дел и обучиться дисциплине и внутреннему миру в монастыре. Теперь, в монастыре, он изучает философию боевых искусств и медитацию, что в свою очередь помогает обрести долгожданную гармонию.',
							style: 'normal'
						}]
					}
				]
			},
			features: {
				type: 'text',
				text: [
					{
						paragraph: [
							{
								type: 'word',
								word: 'Тёмное зрение',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'У Вас есть острые кошачьи чувства, особенно в темноте. На расстоянии в 60 футов вы при тусклом освещении можете видеть так, как будто это яркое освещение, и в темноте так, как будто это тусклое освещение. В темноте вы не можете различать цвета, только оттенки серого.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Кошачьи когти.',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Из-за ваших когтей у вас есть скорость лазания 20 футов. Кроме того, ваши когти — это природное оружие, которое вы можете использовать, совершая безоружные удары.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Защита без брони',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Если вы не носите ни доспех, ни щит, ваш Класс Доспеха равен 10 + модификатор Ловкости + модификатор Мудрости.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Защита без брони',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Если вы не носите ни доспех, ни щит, ваш Класс Доспеха равен 10 + модификатор Ловкости + модификатор Мудрости.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Боевые искусства.',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Ваше знание боевых искусств позволяет вам эффективно использовать в бою безоружные удары и монашеское оружие — короткие мечи, а также любое простое рукопашное оружие, не имеющее свойств «двуручное» и «тяжёлое». Если вы безоружны или используете только монашеское оружие, и не носите ни доспехов, ни щита, вы получаете следующие преимущества: Вы можете использовать Ловкость вместо Силы для бросков атак и урона ваших безоружных ударов и атак монашеским оружием. Вы можете использовать к4 вместо обычной кости урона ваших безоружных ударов или атак монашеским оружием.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Языки: ',
								style: 'bold'
							},
							{
								type: 'word',
								word: 'Общий и табакси',
								style: 'normal'
							}
						]
					}
				]
			},
			notes: [
				{
					id: randomHash(),
					name: 'Заметка о персонажах',
					text: {
						type: 'text',
						text: [
							{
								paragraph: [
									{
										type: 'word',
										word: 'Врен                                    - трактирщик',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Бильдрад                           - лавка',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'мадам Ева                          - глава клана цыган',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Исмарк                               - мэр',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Ирина                                 - сестра Исмарка',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Винный волшебник        - винодельня',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Ректавио                            - глава цирка',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Таверна - синяя вода      - вороньи челики',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Лукьян                                - свещенник (ключи)',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Меловой                            - гробовщик (ключи)',
										style: 'normal'
									}
								]
							},
							{
								paragraph: [
									{
										type: 'word',
										word: 'Айзек                                  - помощник мэра',
										style: 'normal'
									}
								]
							}
						]
					}
				}
			],
			traits: {
				type: 'text',
				text: [
					{
						paragraph: [
							{
								type: 'word',
								word: 'Свободный дух:',
								style: 'bold'
							},
							{
								type: 'word',
								word: 'Борис сохраняет независимый и бунтарский характер, что иногда приводит к конфликтам с установленными порядками монастыря.',
								style: 'normal'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Городской выживальщик:',
								style: 'bold'
							},
							{
								type: 'word',
								word: 'Мой опыт в уличных схватках и опасных ситуациях позволяет ему действовать с интуицией и находить нестандартные решения.',
								style: 'normal'
							}
						]
					}
				]
			},
			prof: {
				type: 'text',
				text: [
					{
						paragraph: [
							{
								type: 'word',
								word: 'Кошачье проворство',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Ваши рефлексы и проворство позволяют вам двигаться с увеличением скорости. Когда вы двигаетесь в бою в свой ход, вы можете удвоить свою скорость до конца хода.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Поступь ветра',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Вы можете потратить 1 очко ци в свой ход, чтобы совершить бонусным действием Отход или Рывок. В этот ход дальность ваших прыжков удваивается.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Терпеливая оборона',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Вы тратите 1 очко ци в свой ход, чтобы совершить бонусным действием Уклонение.',
								style: 'hidden'
							}
						]
					},
					{
						paragraph: [
							{
								type: 'word',
								word: 'Шквал ударов',
								style: 'normal'
							},
							{
								type: 'word',
								word: 'Сразу же после того, как вы в свой ход совершили действие Атака, вы можете потратить 1 очко ци, чтобы бонусным действием совершить два безоружных удара.',
								style: 'hidden'
							}
						]
					}
				]
			},
			quests: {
				type: 'text',
				text: [
					{
						paragraph: [{
							type: 'word',
							word: 'quests',
							style: 'normal'
						}]
					}
				]
			},
			ideals: {
				type: 'text',
				text: [
					{
						paragraph: [{
							type: 'word',
							word: 'Судьба:',
							style: 'bold'
						}]
					},
					{
						paragraph: [{
							type: 'word',
							word: 'Никто и ничто не собьёт меня с пути  к высшему призванию. (Любое)',
							style: 'normal'
						}]
					}
				]
			},
			weaknesses: {
				type: 'text',
				text: [
					{
						paragraph: [{
							type: 'word',
							word: 'Я слепо верю в своё предназначение, и не  замечаю ни своих недостатков, ни  смертельных опасностей.',
							style: 'normal'
						}]
					}
				]
			},
			affections: {
				type: 'text',
				text: [
					{
						paragraph: [{
							type: 'word',
							word: 'Я защищаю тех, кто не может защитить себя  сам.',
							style: 'normal'
						}]
					}
				]
			},
			allies: {
				type: 'text',
				text: [
					{
						paragraph: [{
							type: 'word',
							word: '',
							style: 'normal'
						}]
					}
				]
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
					items: [
						{
							word: 'Воинское оружие',
							id: uuidv4()
						},
						{
							word: 'Пращи',
							id: uuidv4()
						},
						{
							word: 'Кинжалы',
							id: uuidv4()
						},
						{
							word: 'Боевые посохи',
							id: uuidv4()
						}
					]
				},
				{
					category: 'Инструменты',
					categoryId: uuidv4(),
					items: [
						{
							word: 'Воровские инструменты',
							id: uuidv4()
						},
						{
							word: 'Инструменты пивовара',
							id: uuidv4()
						}
					]
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
			score: 14,
			modifier: 2,
			saveProf: 1,
			skills: [
				{
					name: 'Выступление',
					profLevel: 0.5,
					modifier: 3
				},
				{
					name: 'Запугивание',
					profLevel: 0,
					modifier: 2
				},
				{
					name: 'Обман',
					profLevel: 2,
					modifier: 6
				},
				{
					name: 'Убеждение',
					profLevel: 1,
					modifier: 4
				}
			]
		},
		{
			name: 'Ловкость',
			score: 18,
			modifier: 4,
			saveProf: 1,
			skills: [
				{
					name: 'Акробатика',
					profLevel: 1,
					modifier: 6
				},
				{
					name: 'Ловкость рук',
					profLevel: 1,
					modifier: 6
				},
				{
					name: 'Скрытность',
					profLevel: 2,
					modifier: 8
				}
			]
		},
		{
			name: 'Мудрость',
			score: 16,
			modifier: 3,
			saveProf: 0,
			skills: [
				{
					name: 'Внимание',
					profLevel: 2,
					modifier: 7
				},
				{
					name: 'Выживание',
					profLevel: 0,
					modifier: 3
				},
				{
					name: 'Медицина',
					profLevel: 0,
					modifier: 3
				},
				{
					name: 'Проницательность',
					profLevel: 1,
					modifier: 5
				},
				{
					name: 'Уход за животными',
					profLevel: 0,
					modifier: 3
				}
			]
		},
		{
			name: 'Сила',
			score: 12,
			modifier: 1,
			saveProf: 1,
			skills: [
				{
					name: 'Атлетика',
					profLevel: 1,
					modifier: 1
				}
			]
		}
	],
	proficiency: 2,
	backpack: {
		equipment: [
			{
				name: 'Короткий меч',
				count: 1,
				weight: 1
			},
			{
				name: 'Инструменты вора',
				count: 1,
				weight: 5,
				description: 'Владение этими инструментами позволяет добавлять бонус мастерства ко всем проверкам характеристик, сделанным для отключения ловушек и взлома замков. Возможно, чаще всего используемые искателями приключений, воровские инструменты разработаны для взлома замков и обезвреживания ловушек. Владение этими инструментами также даёт вам общие знания о принципах действия ловушек и замков.'
			},
			{
				name: 'Карты',
				count: 1
			},
			{
				name: 'Дротик',
				count: 1000,
				weight: 0.5
			}
		],
		coins: {
			gold: 5000,
			silver: 0,
			copper: 180,
			total: 5001.80
		},
		weapons: weapons,
		treasure: [
			{
				name: 'Печатка',
				count: 1
			},
			{
				name: 'Коробочка из серебра',
				count: 1,
				weight: 2
			},
			{
				name: 'Пустые книги',
				count: 3,
				weight: 0.5
			}
		],
		quest: [
			{
				name: 'завещание (имущество розе и шипу)',
				count: 1
			}
		]
	},
	condition: {
		health: {
			current: 117,
			max: 140,
			extra: 20,
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
		modifier:	3,
		spells:		spells
	}
};

export function createCharacter(): Character {
	return initialCharacter;
}