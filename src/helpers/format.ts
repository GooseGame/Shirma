export function numberToShortString(n: number): string {
	if (n >= 1e3 && n < 1e6)    return +(n / 1e3).toFixed(1)    + 'K';
	if (n >= 1e6 && n < 1e9)    return +(n / 1e6).toFixed(1)    + 'M';
	if (n >= 1e9 && n < 1e12)   return +(n / 1e9).toFixed(1)    + 'B';
	if (n >= 1e12)              return +(n / 1e12).toFixed(1)   + 'T';
	return n.toString();
}

export interface ShortStringNumberFormat {
    value: number,
    mult: string|undefined
}

export function numberToShortStringObj(n: number): ShortStringNumberFormat {
	if (n >= 1e3 && n < 1e6)    return {value: +(n / 1e3).toFixed(1), mult: 'K'};
	if (n >= 1e6 && n < 1e9)    return {value: +(n / 1e6).toFixed(1), mult: 'M'};
	if (n >= 1e9 && n < 1e12)   return {value: +(n / 1e9).toFixed(1), mult: 'B'};
	if (n >= 1e12)              return {value: +(n / 1e12).toFixed(1),mult: 'T'};
	return {value: n, mult: undefined};
}