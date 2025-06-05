import { HTMLAttributes } from 'react';

export interface PopupProps extends HTMLAttributes<HTMLDivElement> {
	popupid:		string;
	header: 		string;
	text:			string;
	isShow?:		boolean;
	closePopup?:	(id: string) => void;
	classNames?:	string;
}