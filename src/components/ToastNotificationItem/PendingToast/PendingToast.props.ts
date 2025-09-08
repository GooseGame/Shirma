import { ReactNode } from 'react';
import { ToastContentProps } from 'react-toastify';

export type PendingToastProps = Partial<ToastContentProps> & {
	pendingPromise: Promise<any>,
	headerPending?: string,
	headerSuccess?: string,
	headerError?: string,
	textError: string,
	textSuccess: string,
	onClickErrButton?: ReactNode
}