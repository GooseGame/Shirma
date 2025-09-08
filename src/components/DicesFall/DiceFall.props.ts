import { HTMLAttributes } from 'react';

export interface DiceFallProps extends HTMLAttributes<HTMLDivElement> {
	containerRef: React.RefObject<HTMLDivElement>,
	countOfDices: number
}