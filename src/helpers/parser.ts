import { Damage } from '../interfaces/Equipment.interface';
import { damages } from './attributes';
import { randomHash } from './random';

interface ParsedDamage {
    count: number;
    edge: number;
    modifiers: number; // +5, -3 и т.д.
    damageType: string;
}

export function normalizeDamageType(damageType: string): string {
	// Убираем окончания (пример для русского языка)
	const endings = [
		'ого', 'ему', 'им', 'ом', 'ем', 'ей', 'ой', 'ую', 'яя', 'его', 'ий', 'ый', 'ая', 'ое', 'ие', 'ые', 'ь',
		'я', 'а', 'о', 'и', 'ы', 'у', 'ю', 'е', 'ё'
	];

	let normalized = damageType.toLowerCase();
	for (const ending of endings) {
		if (normalized.endsWith(ending)) {
			normalized = normalized.slice(0, -ending.length);
			break;
		}
	}

	return normalized;
}

export function getDamageTypeId(normalizedType: string): number | null {
	const foundType = damages.find(
		(type) => normalizeDamageType(type.name.toLowerCase()) === normalizedType
	);
	return foundType ? foundType.id : null;
}

export function parseDamageText(text: string): ParsedDamage | null {
	// Регулярное выражение:
	// ^(\d+)к(\d+)\s*([+-]\s*\d+)?\s+([а-яА-ЯёЁ]+)$
	// Разбирает:
	// - (\d+)к(\d+) → 1к4
	// - \s*([+-]\s*\d+)? → необязательный модификатор (+5, - 3, + 10)
	// - \s+([а-яА-ЯёЁ]+) → тип урона (колющий, рубящий...)
	const regex = /^(\d+)к(\d+)\s*([+-]\s*\d+)?\s+([а-яА-ЯёЁ]+)$/;
	const match = text.match(regex);

	if (!match) {
		return null;
	}

	const count = parseInt(match[1], 10);
	const edge = parseInt(match[2], 10);
	let modifiers = 0;

	// Обрабатываем модификатор (если есть)
	if (match[3]) {
		// Убираем пробелы между + и числом ("+ 5" → "+5")
		const modifierStr = match[3].replace(/\s+/g, '');
		modifiers = parseInt(modifierStr, 10);
	}

	const damageType = match[4].toLowerCase();

	return { count, edge, modifiers, damageType };
}

export function textToDamage(text: string, dmgId?: string): Damage | null {
	const parsed = parseDamageText(text);
	if (!parsed) {
		return null;
	}

	const normalizedType = normalizeDamageType(parsed.damageType);
	const typeId = getDamageTypeId(normalizedType);

	if (typeId === null) {
		return null;
	}

	// Генерируем уникальный ID для dmg_id (можно использовать uuid или другой метод)
	const dmg_id = dmgId ? dmgId : randomHash();

	return {
		dmg_id,
		typeId,
		value: {
			count: parsed.count,
			edge: parsed.edge
		},
		modifiers: parsed.modifiers // По умолчанию модификаторы = 0
	};
}

export function isValidHttpUrl(inputUrl: string) {
	let url;
	
	try {
		url = new URL(inputUrl);
	} catch (_) {
		return false;  
	}
  
	return url.protocol === 'http:' || url.protocol === 'https:';
}