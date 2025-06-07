import { Stat } from '../interfaces/Character.interface';

export function splitStatsBalanced(stats: Stat[]): [Stat[], Stat[]] {
	// Сортируем по количеству скиллов (по убыванию)
	const sortedStats = [...stats].sort((a, b) => b.skills.length - a.skills.length);

	const groupA: Stat[] = [];
	const groupB: Stat[] = [];
	let sumA = 0;
	let sumB = 0;

	for (const stat of sortedStats) {
		if (sumA <= sumB) {
			groupA.push(stat);
			sumA += stat.skills.length;
		} else {
			groupB.push(stat);
			sumB += stat.skills.length;
		}
	}

	return [groupA, groupB];
}