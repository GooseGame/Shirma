import { ReactNode } from 'react';
import { ToastContentProps } from 'react-toastify';

export type ErrorToastProps = Partial<ToastContentProps> & {
	header: string,
	text: string,
	onClickButton?: ReactNode
}