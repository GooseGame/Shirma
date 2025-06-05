import { Damage, WeaponAttribute, WeaponDistance } from '../interfaces/Equipment.interface';
import { DAMAGE_TYPE_SLASHING, ATTRIBUTE_TWO_HANDED, ATTRIBUTE_LONG_MELEE, DAMAGE_TYPE_PIERCING, ATTRIBUTE_DISTANCE, ATTRIBUTE_RELOAD, DAMAGE_TYPE_BLUDGEONING, ATTRIBUTE_ONE_HANDED, ATTRIBUTE_FINESSE, ATTRIBUTE_LIGHT, ATTRIBUTE_THROWN, ATTRIBUTE_HEAVY, ATTRIBUTE_SPECIAL, ATTRIBUTE_UNIVERSAL, ATTRIBUTE_AMMUNITION } from './attributes';
import { randomHash } from './random';

export interface WeaponPreset {
	id: string,
	name: string,
	damage: Damage[],
	attributes: (WeaponAttribute | WeaponDistance)[],
	isMelee: boolean,
	scaleStat: string,
	image?: string,
	description?: string,
	weight?: number
}

export const MAX_DAMAGES_PER_ITEM = 5;

const weapons: WeaponPreset[] = [
	{
		id: 'halberd',
		name: 'Алебарда',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 10 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY}
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 6,
		description: '(20зм) Древковое оружие состоит из рукояти, обычно деревянной, и металлического острия или лезвия на её конце. Это классическое военное оружие, чей широкий радиус действия делает его отличным выбором против крупных противников. Армии часто ставят шеренги солдат, вооруженных древковым оружием на первую линию защиты от атакующей кавалерии, орд гоблинов, великанов и других противников.' 
	},
	{
		id: 'double_crossbow',
		name: 'Арбалет, двойной',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 2, edge: 10 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE,
				distance: 60,
				maxDistance: 240 },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY},
			{ name: 'Перезарядка', id: ATTRIBUTE_RELOAD },
			{ name: 'Боезапас', id: ATTRIBUTE_AMMUNITION }
		],
		description: 'Это тяжёлый арбалет с уменьшенной дистанцией, который зато стреляет сразу двумя болтами.',
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 18
	},
	{
		id: 'warhammer',
		name: 'Боевой молот',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Универсальное', id: ATTRIBUTE_UNIVERSAL }
		],
		isMelee: true,
		scaleStat: 'сила',
		description: '(15зм) Используемые как инструменты для строительства, сноса и ковки, молотки стали излюбленным оружием среди некоторых из самых крепких рас, включая орков и дварфов, которые очень сильны от природы.',
		weight: 2
	},
	{
		id: 'quarterstaff',
		name: 'Боевой посох',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Универсальное', id: ATTRIBUTE_UNIVERSAL }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 4
	},
	{
		id: 'battle_axe',
		name: 'Боевой топор',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Универсальное', id: ATTRIBUTE_UNIVERSAL }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 4,
		description: '(10зм) Изначально топоры предназначались для рубки деревьев и раскалывания поленьев, но потом стали популярным оружием среди лесных жителей. Топоры очень разнообразны по размеру и стилю. У некоторых есть одно лезвие, а у других — два.'
	},
	{
		id: 'mace',
		name: 'Булава',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Одноручное оружие', id: ATTRIBUTE_ONE_HANDED }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 4,
		description: '(5зм) Относящиеся к молотам, но специально задуманные как оружие, булавы представляют собой металлические дубинки с шипами или лезвиями, предназначенные для пробивания брони или сбивания солдата с лошади. Люди высокого статуса могут замысловато украшать свои булавы, и такие булавы — произведения искусства. Но булаву также можно сделать из простого дешёвого железа и бить она будет так же хорошо!'
	},
	{
		id: 'glaive',
		name: 'Глефа',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 10 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 6,
		description: '(20зм)'
	},
	{
		id: 'greatsword',
		name: 'Двуручный меч',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 2, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight:6,
		description: '(50зм) Двуручный меч — это мощное оружие, требующее огромной силы и умения для эффективного использования. Любой неподготовленный герой может ранить себя больше, чем противника, если попытается его использовать!'
	},
	{
		id: 'great_hammer',
		name: 'Двуручный молот',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 2, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 10,
		description: '(10зм) Такие молоты часто используются в состязаниях дварфов — например, кто дальше забросит молот, выпив больше всех эля.'
	},
	{
		id: 'greataxe',
		name: 'Двуручный топор',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 12 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 7,
		description: '(30зм) Изначально топоры предназначались для рубки деревьев и раскалывания поленьев, но потом стали популярным оружием среди лесных жителей. Топоры очень разнообразны по размеру и стилю. У некоторых есть одно лезвие, а у других — два.'
	},
	{
		id: 'longbow',
		name: 'Длинный лук',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE,
				distance: 150,
				maxDistance: 600 },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY},
			{ name: 'Двуручное', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION}
		],
		isMelee: false,
		scaleStat: 'ловкость' ,
		weight: 2,
		description: '(50зм) Короткие и длинные луки используют натяжение тетивы рукой, чтобы посылать стрелу к цели. Короткие луки высотой около трёх футов и могут стрелять в среднем на восемьдесят футов. Длинные луки на пару футов выше и обычно могут стрелять примерно на сто пятьдесят футов, но их не так легко носить с собой. Все луки требуют определенной силы для эффективного использования.'
	},
	{
		id: 'longsword',
		name: 'Длинный меч',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Универсальное', id: ATTRIBUTE_UNIVERSAL }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 3,
		description: '(15зм) Универсальность длинного меча предлагает отличный баланс между скоростью короткого меча и огромной силой двуручного меча. Как одноручное оружие, он позволяет герою наносить быстрые, резкие удары, в то же время позволяя использовать щит в качестве дополнительной защиты. Используемые обеими руками, длинные мечи концентрируют в нанесении ударов всю силу бойца.'
	},
	{
		id: 'dart',
		name: 'Дротик',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Фехтовальное', id: ATTRIBUTE_FINESSE },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE,
				distance: 20,
				maxDistance: 60 }
		],
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 0.25,
		description: '(5мм) Дротики можно бросать на расстоянии около двадцати футов или стрелять из духовой трубки на расстояние около двадцати пяти футов. Дротики не наносят большого урона, поэтому на них часто наносят опасные или смертельные яды, чтобы сделать их эффективнее.'
	},
	{
		id: 'greatclub',
		name: 'Дубина',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Двуручное', id: ATTRIBUTE_TWO_HANDED }
		],
		isMelee: true,
		weight: 10,
		scaleStat: 'сила',
		description: '(2см)'
	},
	{
		id: 'dubinka',
		name: 'Дубинка',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 2,
		description: '(1см)'
	},
	{
		id: 'iklwa',
		name: 'Иклва',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 10, maxDistance: 30 },
			{ name: 'Метательное', id: ATTRIBUTE_THROWN }
		],
		isMelee: true,
		scaleStat: 'сила',
		description: '(1зм) Иклва — это традиционное оружие ближнего боя чультских воинов. Иклва состоит из 3-футовой деревянной рукояти со стальным или каменным лезвием длиной до 18 дюймов.'
	},
	{
		id: 'lance',
		name: 'Кавалерийская пика',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 12 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Особое', id: ATTRIBUTE_SPECIAL }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 6,
		description: '(10зм) Вы совершаете с помехой атаки кавалерийской пикой по существам в пределах 5 футов. Кроме того, если Вы не находитесь верхом, кавалерийская пика используется двумя руками.'
	},
	{
		id: 'dagger',
		name: 'Кинжал',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT },
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 20, maxDistance: 60 }
		],
		description: '(2зм) Любимая игрушка дьявола.',
		isMelee: true,
		weight: 1,
		scaleStat: 'ловкость' 
	},
	{
		id: 'war_pick',
		name: 'Клевец',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Одноручное оружие', id: ATTRIBUTE_ONE_HANDED }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 2,
		description: '(5зм) Маленький, острый шип с рукоятью, традиционно используемый для разрушения льда или камня. Кирку легко спрятать и она эффективен в ближнем бою.'
	},
	{
		id: 'whip',
		name: 'Кнут',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE }
		],
		isMelee: true,
		scaleStat: 'ловкость',
		weight: 3,
		description: '(2зм) Традиционно используемые для управления скотом, кнуты всё же могут быть использованы как оружие тренированным профессионалом. Некоторые кнуты бьют на двадцать футов, давая большую дальность, чем большинство оружия ближнего боя!'
	},
	{
		id: 'spear',
		name: 'Копьё',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Универсальное', id: ATTRIBUTE_UNIVERSAL },
			{ name: 'Метательное', id: ATTRIBUTE_THROWN},
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 20, maxDistance: 60 }
		],
		isMelee: true,
		scaleStat: 'сила',
		description: '(1зм) Кинжалы, сюрикены и другое метательное оружие имеют дальность броска от двадцати до тридцати футов, в зависимости от их веса и конструкции. Они требуют большой ловкости и меткости для эффективного использования.'
	},
	{
		id: 'shortbow',
		name: 'Короткий лук',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 80, maxDistance: 320 },
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION },
			{ name: 'Двуручное', id: ATTRIBUTE_TWO_HANDED }
		],
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 2,
		description: '(25зм) Короткие и длинные луки используют натяжение тетивы рукой, чтобы посылать стрелу к цели. Короткие луки высотой около трёх футов и могут стрелять в среднем на восемьдесят футов. Длинные луки на пару футов выше и обычно могут стрелять примерно на сто пятьдесят футов, но их не так легко носить с собой. Все луки требуют определенной силы для эффективного использования.'
	},
	{
		id: 'shortsword',
		name: 'Короткий меч',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT },
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE }
		],
		isMelee: true,
		scaleStat: 'ловкость',
		description: '(10зм) Быстрые и универсальные, короткие мечи популярны среди большинства классов персонажей. Малый вес делает их отличным выбором для длительных путешествий, а низкая цена делает их популярным вариантом для искателей приключений, которые только начинают.',
		weight: 2
	},
	{
		id: 'light_crossbow',
		name: 'Лёгкий арбалет',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Перезарядка', id: ATTRIBUTE_RELOAD },
			{ name: 'Двуручное', id: ATTRIBUTE_TWO_HANDED},
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 80, maxDistance: 320 },
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION}
		],
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 5,
		description: '(25зм) Железный замок этого арбалета покрыт пятнами ржавчины.'
	},
	{
		id: 'light_hammer',
		name: 'Лёгкий молот',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 20, maxDistance: 60 },
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 2,
		description: '(2зм) Используемые как инструменты для строительства, сноса и ковки, молотки стали излюбленным оружием среди некоторых из самых крепких рас, включая орков и дварфов, которые очень сильны от природы.'
	},
	{
		id: 'morningstar',
		name: 'Моргенштерн',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Одноручное оружие', id: ATTRIBUTE_ONE_HANDED }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 4,
		description: '(15зм) Воинское оружие включает мечи, топоры и древковое оружие, требующее для эффективного использования особых тренировок. Многие воители используют воинское оружие, потому что оно позволяет максимально использовать их стиль и обучение.'
	},
	{
		id: 'pike',
		name: 'Пика',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 10 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Двуручное оружие', id: ATTRIBUTE_TWO_HANDED },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY}
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 18,
		description: '(5зм) Недорогая, простая и эффективная пика — отличный выбор оружия для начинающих героев, которым не хватает золота.'
	},
	{
		id: 'pilum',
		name: 'Пилум',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 30, maxDistance: 120 }
		],
		isMelee: false,
		scaleStat: 'сила',
		weight: 2,
		description: '(5см) Кинжалы, сюрикены и другое метательное оружие имеют дальность броска от двадцати до тридцати футов, в зависимости от их веса и конструкции. Они требуют большой ловкости и меткости для эффективного использования.'
	},
	{
		id: 'sling',
		name: 'Праща',
		damage: [
			{ typeId: DAMAGE_TYPE_BLUDGEONING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 30, maxDistance: 120 },
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION}
		],
		isMelee: false,
		scaleStat: 'ловкость',
		description: '(1см) Простое метательное оружие, сделанное из мешочка и шнура, праща используются для того, чтобы метать маленький круглый снаряд с большой силой примерно на тридцать футов. Обычно используются снаряды из твердого металла, называемые «пулями», но большим преимуществом пращи является то, что ей также можно запускать любые мелкие объекты, такие как камни или даже монеты!'
	},
	{
		id: 'rapier',
		name: 'Рапира',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE }
		],
		isMelee: true,
		scaleStat: 'ловкость',
		weight: 2,
		description: '(25зм) Узкий, острый клинок. Излюбленное оружие аристократии Глубоководья.'
	},
	{
		id: 'hand_crossbow',
		name: 'Ручной арбалет',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 30, maxDistance: 120 },
			{ name: 'Перезарядка', id: ATTRIBUTE_RELOAD },
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION},
			{ name: 'Лёгкое', id: ATTRIBUTE_LIGHT}
		],
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 3,
		description: '(75зм) Ручные арбалеты маленькие и могут использоваться одной рукой, но имеют обычный дальность около тридцати футов, и тетиву нужно вытягивать назад вручную.'
	},
	{
		id: 'scimitar',
		name: 'Скимитар',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT },
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE }
		],
		isMelee: true,
		scaleStat: 'ловкость',
		weight: 3,
		description: '(25зм) Скимитар — это изогнутый одноручный меч с широким лезвием, часто использовавшийся в Средней Азии.'
	},
	{
		id: 'sickle',
		name: 'Серп',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 4 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Лёгкое оружие', id: ATTRIBUTE_LIGHT }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 2,
		description: '(1зм) Маленькая одноручная версия косы. Изогнутое лезвие делает его отличным выбором для мастеров боевых искусств, которые бьют под неожиданными углами.' 
	},
	{
		id: 'net',
		name: 'Сеть',
		damage: [],
		attributes: [
			{ name: 'Особое оружие', id: ATTRIBUTE_SPECIAL },
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 5, maxDistance: 15 }
		],
		isMelee: false,
		scaleStat: 'нет',
		weight: 3,
		description: `(1зм) Тяжёлые рыболовные сети могут быть брошены в противников, запутывая их и делая их уязвимыми для последующих атак.
Особое: Существа Большого и меньшего размеров, по которым попала атака сетью, становятся обездвижеными, пока не высвободятся. Сеть не оказывает эффекта на бесформенных существ и тех, чей размер Огромный или ещё больше. Существо может действием совершить проверку Силы СЛ 10, чтобы высвободиться самому или освободить другое существо, находящееся в пределах его досягаемости. 
Причинение сети 5 единиц рубящего урона (КД 10) тоже освобождает существо, не причиняя ему вреда, оканчивая эффект и уничтожая сеть.
Если Вы действием, бонусным действием или реакцией совершаете атаку сетью, Вы можете совершить только одну атаку, вне зависимости от количества положенных атак.`
	},
	{
		id: 'heavy_crossbow',
		name: 'Тяжёлый арбалет',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 10 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 100, maxDistance: 400 },
			{ name: 'Перезарядка', id: ATTRIBUTE_RELOAD },
			{ name: 'Тяжелое', id: ATTRIBUTE_HEAVY},
			{ name: 'Боеприпас', id: ATTRIBUTE_AMMUNITION},
			{ name: 'Двуручное', id: ATTRIBUTE_TWO_HANDED}
		],
		isMelee: false,
		scaleStat: 'ловкость',
		weight: 18,
		description: '(50зм) Арбалеты — это простое механическое оружие, активируемое нажатием на спусковой крючок, чтобы отпустить защёлку на тетиве, посылая болт к цели. Есть три популярных типа арбалетов.'
	},
	{
		id: 'trident',
		name: 'Трезубец',
		damage: [
			{ typeId: DAMAGE_TYPE_PIERCING, value: { count: 1, edge: 6 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Метательное оружие', id: ATTRIBUTE_THROWN },
			{ name: 'Универсальное оружие', id: ATTRIBUTE_UNIVERSAL },
			{ name: 'Дистанционное оружие', id: ATTRIBUTE_DISTANCE, distance: 20, maxDistance: 60 }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 4,
		description: '(5зм) Копьё с тремя зубцами, предназначенное для подводной рыбалки. Трезубец можно использовать как метательное или колющее оружие.'
	},
	{
		id: 'chain',
		name: 'Цеп',
		damage: [
			{ typeId: DAMAGE_TYPE_SLASHING, value: { count: 1, edge: 8 }, modifiers: 0, dmg_id: randomHash() }
		],
		attributes: [
			{ name: 'Длинное оружие', id: ATTRIBUTE_LONG_MELEE },
			{ name: 'Фехтовальное оружие', id: ATTRIBUTE_FINESSE }
		],
		isMelee: true,
		scaleStat: 'сила',
		weight: 2,
		description: '(10зм) железная штука на цепи'
	}
];

export default weapons;
