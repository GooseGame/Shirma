import { HTMLAttributes } from 'react';

export interface EditCalcPopupProps extends HTMLAttributes<HTMLDivElement> {
	header: 		string,
	onCancel: 		()=>void,
	setPopup:		(text: string, header: string)=>void,
	onSave?: 		(value: number)=>void,
	color?: 		string,
	mode:			'health'|'coins'|'exp',
	float?: 		'left'|'center'|'right'
}