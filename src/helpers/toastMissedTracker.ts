import type { ReactNode } from 'react';

export type MissedToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface MissedToastItem {
	id: string;
	variant: MissedToastVariant;
	header: string;
	text: string;
	onClickButton?: ReactNode;
}

type MissedToastHandler = (item: MissedToastItem) => void;

let handler: MissedToastHandler | null = null;
let ignoreNextAutoReports = 0;

export function setMissedToastHandler(next: MissedToastHandler | null) {
	handler = next;
}

export function ignoreMissedReportsForMs(ms = 800) {
	ignoreNextAutoReports += 1;
	window.setTimeout(() => {
		ignoreNextAutoReports = Math.max(0, ignoreNextAutoReports - 1);
	}, ms);
}

export function reportMissedToast(item: MissedToastItem) {
	if (ignoreNextAutoReports > 0) return;
	handler?.(item);
}

