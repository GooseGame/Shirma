export interface PointsLevelProficiency {
    level:          number,
    exp:            number,
    proficiency:    number
}

export const pointsLevelProficiencies: PointsLevelProficiency[] = [
	{
		level: 1,
		exp: 0,
		proficiency: 2
	},
	{
		level: 2,
		exp: 300,
		proficiency: 2
	},
	{
		level: 3,
		exp: 900,
		proficiency: 2
	},
	{
		level: 4,
		exp: 2700,
		proficiency: 2
	},
	{
		level: 5,
		exp: 6500,
		proficiency: 3
	},
	{
		level: 6,
		exp: 14000,
		proficiency: 3
	},
	{
		level: 7,
		exp: 23000,
		proficiency: 3
	},
	{
		level: 8,
		exp: 34000,
		proficiency: 3
	},
	{
		level: 9,
		exp: 48000,
		proficiency: 4
	},
	{
		level: 10,
		exp: 64000,
		proficiency: 4
	},
	{
		level: 11,
		exp: 85000,
		proficiency: 4
	},
	{
		level: 12,
		exp: 100000,
		proficiency: 4
	},
	{
		level: 13,
		exp: 120000,
		proficiency: 5
	},
	{
		level: 14,
		exp: 140000,
		proficiency: 5
	},
	{
		level: 15,
		exp: 165000,
		proficiency: 5
	},
	{
		level: 16,
		exp: 195000,
		proficiency: 5
	},
	{
		level: 17,
		exp: 225000,
		proficiency: 6
	},
	{
		level: 18,
		exp: 265000,
		proficiency: 6
	},
	{
		level: 19,
		exp: 305000,
		proficiency: 6
	},
	{
		level: 20,
		exp: 355000,
		proficiency: 6
	}
];

export function nextLevelExpCap(currExp: number): number|undefined {
	const expToNext = pointsLevelProficiencies.find((el)=>{
		if (currExp <= el.exp) {
			return el;
		}
	});
	if (expToNext) {
		return expToNext.exp;
	} else {
		return undefined;
	}
}

export function thatLevelLowBorder(currLevel: number):number {
	const minExp = pointsLevelProficiencies.find((el) => {
		if (currLevel === el.level) return el;
	});
	if (minExp) {
		return minExp.exp;
	} else return 0;
}

export function getCurrentLevelByExp(currExp: number): number {
	const expToNext = pointsLevelProficiencies.find((el)=>{
		if (currExp <= el.exp) {
			return el;
		}
	});
	return expToNext ? expToNext.level : 1;
}