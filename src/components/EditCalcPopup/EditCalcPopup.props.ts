import { HTMLAttributes } from 'react';

export interface EditCalcPopupProps extends HTMLAttributes<HTMLDivElement> {
	header: 		string,
	onCancel: 		()=>void,
	onSave?: 		(value: number)=>void,
	color?: 		string,
	mode:			'health'|'coins'|'exp',
	float?: 		'left'|'center'|'right'
}