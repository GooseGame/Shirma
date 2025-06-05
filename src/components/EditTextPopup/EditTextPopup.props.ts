import { HTMLAttributes, ReactNode } from 'react';
import { Text } from '../../interfaces/Text.interface';

export interface EditTextPopupProps extends HTMLAttributes<HTMLDivElement> {	
	editValue: Text|undefined,
	header:	string,
	onSave?: (text: Text)=>void;
	onCancel: ()=>void;
	color?: string;
	onSaveWithHeader?: (text: Text, header: string) => void;
	onDelete?: ()=>void;
	wrapperCN?: string;
	children?: ReactNode;
	textareaCN?: string;
}