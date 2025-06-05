import { HTMLAttributes, ReactNode } from 'react';

export interface CalcButoonProps extends HTMLAttributes<HTMLButtonElement> {
	titleEl?: ReactNode,
	onClickAction: ()=>void,
	buttonCN?: string,
	width: 1|2|3
}