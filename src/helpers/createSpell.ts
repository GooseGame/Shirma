import { Spell, SpellComponet } from '../interfaces/spells.interface';
import { randomHash } from './random';

export const cellsColorObj = [
	{src: 'cell-d20.svg', title: 'Хоумбрю'},
	{src: 'cell-d20-artificer.svg', title: 'Изобретатель'},
	{src: 'cell-d20-barbarian.svg', title: 'Варвар'},
	{src: 'cell-d20-bard.svg', title: 'Бард'},
	{src: 'cell-d20-cleric.svg', title: 'Жрец'},
	{src: 'cell-d20-druid.svg', title: 'Друид'},
	{src: 'cell-d20-fighter.svg', title: 'Воин'},
	{src: 'cell-d20-monk.svg', title: 'Монах'},
	{src: 'cell-d20-paladin.svg', title: 'Паладин'},
	{src: 'cell-d20-ranger.svg', title: 'Следопыт'},
	{src: 'cell-d20-rogue.svg', title: 'Плут'},
	{src: 'cell-d20-sorcerer.svg', title: 'Чародей'},
	{src: 'cell-d20-warlock.svg', title: 'Колдун'},
	{src: 'cell-d20-wisard.svg', title: 'Волшебник'}
];

export const verbalComponentDescription = 'Большинство заклинаний требуют произношения таинственных слов. Сами по себе слова не являются источником силы заклинания; просто комбинация звуков с особой тональностью вызывает резонанс в прядях магии, приводя их в движение. Таким образом, персонаж с кляпом во рту или в области заклинания тишина, не может активировать заклинания с вербальным компонентом.';

export const verbalComponentTemplate: SpellComponet = {
	fullName: 'Вербальный',
	shortLetter: 'В'	
};

export const somaticComponentDescription = 'Заклинание может требовать энергичной жестикуляции или замысловатой последовательности телодвижений. Если у заклинания есть соматический компонент, у заклинателя должна быть свободной хотя бы одна рука для исполнения этих жестов.';

export const somaticComponentTemplate: SpellComponet = {
	fullName: 'Соматический',
	shortLetter: 'С'
};

export const materialComponentDescription = 'Накладывание некоторых заклинаний требует наличия особых предметов, указанных в скобках в описании заклинания. Персонаж может использовать мешочек с компонентами или заклинательную фокусировку вместо указанных компонентов. Однако, если для компонента указана цена, у персонажа для накладывания заклинания должен быть именно такой компонент. Если в заклинании сказано, что материальные компоненты расходуются, заклинатель должен предоставить компоненты для каждого использования этого заклинания. У заклинателя должна быть одна свободная рука для доступа к материальным компонентам, но это может быть та же самая рука, что используется для выполнения соматического компонента.';

export const materialComponentTemplate: SpellComponet = {
	fullName: 'Материальный',
	shortLetter: 'М',
	extra: 'кусочек фосфора, гнилушка или светлячок'
};

export const spells: Spell[] = [];

export const newSpellTemplate = {
	name: 'Новое заклинание',
	distance: 'Дистанция заклинания',
	duration: 'Длительность заклинания',
	castTime: 'Время каста',
	id: randomHash(),
	description: {type: 'text', text:[]},
	components: [],
	availibleFor: [],
	level: 0,
	concentration: false,
	aim: false
} as Spell;