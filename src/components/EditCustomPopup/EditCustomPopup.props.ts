import { HTMLAttributes, ReactNode } from 'react';

export interface EditCustomPopupProps extends HTMLAttributes<HTMLDivElement> {
	children: 	ReactNode,
	header: 	string,
	onCancel: 	()=>void,
	onDelete?: 	()=>void,
	color?:		string,
	wrapperCN?: string,
	scrollable?:boolean,
	fakeSaveBtn?: boolean,
	onSave?:	()=>void,
	float?: 'left'|'center'|'right'
}