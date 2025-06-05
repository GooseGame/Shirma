import { HTMLAttributes } from 'react';
import { PopupProps } from '../Popup/Popup.props';

export interface NotificationCenterProps extends HTMLAttributes<HTMLDivElement> {
	popups: PopupProps[],
	remove: (id: string)=>void,
	clear: ()=>void
}