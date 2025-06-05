import { AttributeExtended, Damage, DamageTypeExtended, DiceCheck } from '../interfaces/Equipment.interface';

export const DAMAGE_TYPE_ACID           = 1;
export const DAMAGE_TYPE_FIRE           = 2;
export const DAMAGE_TYPE_NECROSIS       = 3;
export const DAMAGE_TYPE_PSYCHIC        = 4;
export const DAMAGE_TYPE_THUNDER        = 5;
export const DAMAGE_TYPE_BLUDGEONING    = 6;
export const DAMAGE_TYPE_FORCE          = 7;
export const DAMAGE_TYPE_PIERCING       = 8;
export const DAMAGE_TYPE_RADIANT        = 9;
export const DAMAGE_TYPE_COLD           = 10;
export const DAMAGE_TYPE_LIGHTNING      = 11;
export const DAMAGE_TYPE_POISON         = 12;
export const DAMAGE_TYPE_SLASHING       = 13;
export const DAMAGE_TYPE_BLUEBERRY      = 14;

export const damageTypes = [
	DAMAGE_TYPE_ACID,
	DAMAGE_TYPE_FIRE,
	DAMAGE_TYPE_NECROSIS,
	DAMAGE_TYPE_PSYCHIC,
	DAMAGE_TYPE_THUNDER,
	DAMAGE_TYPE_BLUDGEONING,
	DAMAGE_TYPE_FORCE,
	DAMAGE_TYPE_PIERCING,
	DAMAGE_TYPE_RADIANT,
	DAMAGE_TYPE_COLD,
	DAMAGE_TYPE_LIGHTNING,
	DAMAGE_TYPE_POISON,
	DAMAGE_TYPE_SLASHING,
	DAMAGE_TYPE_BLUEBERRY
];

export interface associativeDamage {
	[key: number]: number;
}

export const ATTRIBUTE_DISTANCE		    	= 15;
export const ATTRIBUTE_RELOAD		    	= 16;
export const ATTRIBUTE_ONE_HANDED			= 17;
export const ATTRIBUTE_TWO_HANDED			= 18;
export const ATTRIBUTE_UNIVERSAL			= 19;
export const ATTRIBUTE_LONG_MELEE			= 20;
export const ATTRIBUTE_AMMUNITION_RELOAD	= 21;
export const ATTRIBUTE_AMMUNITION			= 22;
export const ATTRIBUTE_AMMUNITION_FIREARM	= 23;
export const ATTRIBUTE_RETURNING		    = 24;
export const ATTRIBUTE_DUAL		    		= 25;
export const ATTRIBUTE_LIGHT		    	= 26;
export const ATTRIBUTE_MAG		    		= 27;
export const ATTRIBUTE_THROWN		    	= 28;
export const ATTRIBUTE_SPECIAL		    	= 29;
export const ATTRIBUTE_BURST_FIRE		    = 30;
export const ATTRIBUTE_GUNPOWDER		    = 31;
export const ATTRIBUTE_HIDDEN		    	= 32;
export const ATTRIBUTE_HEAVY		    	= 33;
export const ATTRIBUTE_FINESSE		    	= 34;
export const ATTRIBUTE_EXOTIC				= 35;

export const distanceExtendedPreset = {
	id: ATTRIBUTE_DISTANCE,
	name: 'Дистанция выстрела',
	img: '',
	bgColor: '#A34C50',
	color: '#D9D9D9',
	desc: 'Диапазон состоит из двух чисел. Первое — это нормальная дистанция в футах, а второе указывает максимальную дистанцию оружия. При совершении атаки по цели, находящейся на расстоянии, превышающем нормальную дистанцию, бросок атаки совершается с помехой. Цель, находящуюся на расстоянии, превышающем максимальную дистанцию, атаковать нельзя.',
	type: 'distance'
};

export const attributes: AttributeExtended[] = [
	{
		id: ATTRIBUTE_RELOAD,
		name: 'Перезарядка',
		img: '/reload-white.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Из-за долгой перезарядки этого оружия вы можете выстрелить из него только один боеприпас одним действием, бонусным действием или реакцией, вне зависимости от количества положенных атак.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_ONE_HANDED,
		name: 'Одноручное',
		img: '/1-hand.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Одна рука свободна...',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_TWO_HANDED,
		name: 'Двуручное',
		img: '/2-hand.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Это оружие нужно держать двумя руками, когда вы атакуете им.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_UNIVERSAL,
		name: 'Универсальное',
		img: '',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Оружие для одной или двух рук. Урон может различаться',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_LONG_MELEE,
		name: 'Досягаемость',
		img: '/long.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Длинное рукопашное оружие. Это оружие добавляет 5 футов к расстоянию, на котором вы можете совершать этим оружием атаки, а также провоцированные атаки.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_AMMUNITION_RELOAD,
		name: 'Досягаемость',
		img: '/x.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Из оружия с этим свойством можно совершить ограниченное число выстрелов. После этого персонаж должен перезарядить его Действием или бонусным действием (на свой выбор).',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_AMMUNITION,
		name: 'Боеприпас',
		img: '/arrow.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Оружие, использующее боеприпасы. Вы можете использовать оружие со свойством «боеприпас» для совершения дальнобойной атаки только если у вас есть боеприпасы для стрельбы. Каждый раз, когда вы совершаете атаку с помощью этого оружия, вы тратите один боеприпас. Вынимается боеприпас из колчана или другого контейнера частью атаки. Для зарядки одноручного оружия требуется одна свободная рука. В конце сражения вы восстанавливаете половину использованных боеприпасов, потратив минуту на поиски на поле боя. Если вы используете оружие со свойством «боеприпас» для совершения рукопашной атаки, вы считаете его импровизированным оружием (смотрите «Импровизированное оружие»). Праща при этом должна быть заряжена.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_AMMUNITION_FIREARM,
		name: 'Боеприпас огнестрельный',
		img: '/x.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Боеприпасы огнестрельного оружия уничтожаются при использовании. Современное оружие и оружие эпохи Возрождения использует пули и патроны. Футуристическое оружие использует особые боеприпасы, называемые батареями. В одной батарее достаточно энергии, чтобы сделать все выстрелы, которые способно совершить оружие.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_RETURNING,
		name: 'Возвращающееся',
		img: '/returning.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Когда метательное оружие со свойством Возвращающееся метнули как часть атаки, оно возвращается к своему владельцу в конце его хода. Персонаж должен воспользоваться своим взаимодействием с предметом, чтобы поймать возвращающееся оружие или оно возвращается в землю у ног персонажа. Метая возвращающееся оружие, Вы можете выбрать чтобы оружие не возвращалось, чтобы добавить 5 фт. к его нормальной и 10фт. к его максимальной дистанции.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_DUAL,
		name: 'Двойное оружие',
		img: '/dual.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Требует две руки для использования, и рассматривается как два отдельных одноручных оружия. Оба из этих оружий считаются имеющими свойство Легкое, и ни у одного из них нет свойства Двуручное. Зачаровывается как единый предмет, и зачарование относится к обоим половинам оружия. Разоружение или разрушение любой стороны двойного оружия затрагивает всё оружие.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_LIGHT,
		name: 'Лёгкое',
		img: '/not-heavy.svg',
		bgColor: '#D9D9D9',
		color: '#1E1E1E',
		desc: 'Оружием легко управляться одной рукой. Лёгкое оружие маленькое и удобное, и идеально подходит для сражения двумя оружиями.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_MAG,
		name: 'Магазин',
		img: '/x.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Это оружие может содержать несколько единиц боеприпасов в съемной коробке, цилиндре или другом контейнере. Вместе со свойством появляется значение в круглых скобках, указывающее, сколько боеприпасов может вместить его магазин. Каждый раз, когда вы совершаете бросок атаки с помощью этого оружия, из магазина расходуется часть боеприпасов. Это оружие не нужно перезаряжать между каждой атакой, при условии, что в магазине остались патроны, что позволяет вам совершать несколько атак с помощью оружия, если вы можете совершать несколько атак с помощью действия Атака. Когда патроны в магазине будут израсходованы, вы можете заменить пустой магазин на полный в качестве Действия или бонусного действия. Заправка пустого магазина патронами занимает 1 минуту.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_THROWN,
		name: 'Метательное',
		img: '/throwing.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Оружие можно метнуть. Если у оружия есть свойство «метательное», вы можете совершать им дальнобойные атаки, метая его. Если это рукопашное оружие, вы используете для бросков атаки и урона тот же модификатор характеристики, что и при совершении рукопашной атаки этим оружием. Например, если вы метаете ручной топор [handaxe], вы используете Силу, а если метаете кинжал [dagger], то можете использовать либо Силу, либо Ловкость, так как у кинжала есть свойство Фехтовальное.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_SPECIAL,
		name: 'Особое',
		img: '/special.svg',
		bgColor: '#2C5B70',
		color: '#D9D9D9',
		desc: 'Оружие с особым свойством. Оружие со свойством «особое» используется по специальным правилам, указанным в описании этого оружия.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_GUNPOWDER,
		name: 'Пороховое',
		img: '/gunpowder.svg',
		bgColor: '#623638',
		color: '#D9D9D9',
		desc: `Если при атаке этим оружием вы бросаете максимальное значение урона на кубиках (например, 6 на к6 или 12 на к12), вы можете снова бросить этот кубик и добавить результат к общему количеству. Когда на кубике выпадает максимальное значение, это называется “взрывом”
Если вы снова бросите максимально возможное число, вы можете снова бросить кубик урона и добавить результат к общему количеству, еще больше увеличив урон оружия.
Если одна атака оружием или предметом с этим свойством поражает несколько целей, урон рассматривается как одна атака или эффект для определения того, сколько раз урон может быть нанесен взрывом, независимо от того, сколько целей получают урон.`,
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_HIDDEN,
		name: 'Скрытое',
		img: '/eye-white.svg',
		bgColor: '#31404B',
		color: '#1E1E1E',
		desc: 'Когда оружие не на виду, проверки Ловкость (Ловкость рук) чтобы спрятать это оружие осуществляется с преимуществом.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_HEAVY,
		name: 'Тяжёлое',
		img: '/heavy.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Слишком тяжёлое для малых существ. Существа Маленького или Крошечного размера совершают броски атаки тяжёлым оружием с помехой. Из-за размера и веса Маленькие или Крошечные существа не могут использовать такое оружие эффективно.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_FINESSE,
		name: 'Фехтовальное',
		img: '/finesse.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: 'Использует Ловкость вместо Силы. При совершении атаки фехтовальным оружием вы сами выбираете, какой модификатор использовать при совершении бросков атаки и урона — модификатор Силы или Ловкости. Для обоих бросков должен использоваться один и тот же модификатор.',
		type: 'attribute'
	},
	{
		id: ATTRIBUTE_EXOTIC,
		name: 'Экзотическое',
		img: '/exotic.svg',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		desc: `Экзотическое оружие, столь специфическое и сильное, что требует знаний, выраженных особой чертой, чтобы получить бонус мастерства.
		Ни у одного персонажа не может быть мастерства в этом оружии от любых источников, кроме как от черты, но как только мастерство получено, Экзотическое оружие может использоваться для особенностей классов.`,
		type: 'attribute'
	}
];

export const damages: DamageTypeExtended[] = [
	{
		id: DAMAGE_TYPE_ACID,
		name: 'Кислотный',
		img: '/acid.svg',
		desc: 'Едкое дыхание чёрного дракона и растворяющая слизь чёрного пудинга причиняют урон кислотой.',
		bgColor: '#265E2F',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_FIRE,
		name: 'Огненный',
		img: '/fire.svg',
		desc: 'Красный дракон, выдыхающий пламя, и многие заклинания, создающие жар, причиняют урон огнём.',
		bgColor: '#A82B2B',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_NECROSIS,
		name: 'Некротический',
		img: '/dead.svg',
		desc: 'Некротическая энергия, излучаемая некоторой нежитью и такими заклинаниями как леденящее прикосновение, иссушают плоть и даже душу.',
		bgColor: '#848484',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_PSYCHIC,
		name: 'Психический',
		img: '/pcyhic.svg',
		desc: 'Атаки силой разума, такие как у иллитидов, причиняют урон психической энергией.',
		bgColor: '#363570',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_THUNDER,
		name: 'Звуковой',
		img: '/sound.svg',
		desc: 'Оглушительные звуковые волны, такие как от заклинания волна грома, причиняют урон звуком.',
		bgColor: '#673179',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_BLUDGEONING,
		name: 'Дробящий',
		img: '/broken-bone.svg',
		desc: 'Тяжёлые силовые атаки — молотом, падением, сдавливанием и т. п. — причиняют дробящий урон.',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_FORCE,
		name: 'Силовой',
		img: '/force.svg',
		desc: 'Силовое поле это чистая магия, сфокусированная в разрушительную силу. Чаще всего силовым полем причиняют урон заклинания, такие как волшебная стрела и божественное оружие.',
		bgColor: '#2C5B70',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_PIERCING,
		name: 'Колющий',
		img: '/pierce.svg',
		desc: 'Колющие и пронзающие атаки, включая удары копьём и укусы чудовищ, причиняют колющий урон.',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_RADIANT,
		name: 'Излучение',
		img: '/light.svg',
		desc: 'Урон излучением, причиняемый заклинанием небесный огонь жреца и карающим оружием ангела, опаляют плоть как огонь и переполняют дух силой.',
		bgColor: '#D3CD98',
		color: '#1E1E1E',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_COLD,
		name: 'Холод',
		img: '/cold.svg',
		desc: 'Лютый холод от копья ледяного дьявола и морозное дыхание белого дракона причиняют урон холодом.',
		bgColor: '#BBD0E4',
		color: '#1E1E1E',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_LIGHTNING,
		name: 'Электрический',
		img: '/lightning.svg',
		desc: 'Заклинание молния и дыхание синего дракона причиняют урон электричеством.',
		bgColor: '#0F3445',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_POISON,
		name: 'Ядовитый',
		img: '/effect.svg',
		desc: 'Ядовитые укусы и токсичное дыхание зелёного дракона причиняют урон ядом.',
		bgColor: '#53A34C',
		color: '#1E1E1E',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_SLASHING,
		name: 'Рубящий',
		img: '/rub.svg',
		desc: 'Мечи, топоры, лезвия из стен и когти чудовищ причиняют рубящий урон.',
		bgColor: '#1E1E1E',
		color: '#D9D9D9',
		type: 'damage'
	},
	{
		id: DAMAGE_TYPE_BLUEBERRY,
		name: 'Черничный',
		img: '/blueberry.svg',
		desc: 'Черника (да)',
		bgColor: '#D0AEBC',
		color: '#1E1E1E',
		type: 'damage'
	}
];

export const getDamageById = (id: number) => {
	return damages.find(damage => (damage.id === id));
};

export const getAttributeById = (id: number) => {
	return attributes.find(attr => (attr.id === id));
};

export const handleAimClick = (modifier: number, setDiceRoll: React.Dispatch<React.SetStateAction<Damage[]| DiceCheck[]>>) => {
	setDiceRoll([
		{
			typeId: 0,
			modifiers: modifier,
			value: {
				count: 1,
				edge: 20
			}
		}
	]);
}; 

export const handleDamageClick = (dmg: Damage[], setDiceRoll: React.Dispatch<React.SetStateAction<Damage[]| DiceCheck[]>>) => {
	setDiceRoll(dmg);
};