import { ToastContentProps } from 'react-toastify';

export type DefaultToastProps = Partial<ToastContentProps> & {
	header: string,
	text: string
}