import { ReactNode } from 'react';
import { ToastContentProps } from 'react-toastify';

export type WarningToastProps = Partial<ToastContentProps> & {
	header: string,
	text: string,
	onClickButton?: ReactNode
}