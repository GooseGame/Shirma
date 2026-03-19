import { useEffect, useState } from 'react';
import { PendingToastProps } from './PendingToast.props';
import { Id, toast } from 'react-toastify';
import React from 'react';
import styles from './../ToastNotificationItem.module.css';
import { errorToast, pendingToast, successToast } from '../../../helpers/toastOptions';
import { ErrorToast } from '../ErrorToast/ErrorToast';
import { SuccessToast } from '../SuccessToast/SuccessToast';

export function PendingToast({pendingPromise, headerError, textError, headerPending, headerSuccess, textSuccess, onClickErrButton}: PendingToastProps) {
	const hError = headerError ?? 'Ошибка';
	const hPending = headerPending ?? 'Загрузка...';
	const hSuccess = headerSuccess ?? 'Успешно';
	const tSuccess = textSuccess ?? '';
	const tError = textError ?? '';
	const [status, setStatus] = useState<'pending'|'fulfilled'|'rejected'>('pending');
	const toastId = React.useRef<Id | null>(null);

	useEffect(()=>{
		let isMounted = true;
		if (status === 'pending') {
			toastId.current = toast(getPendingBody(), pendingToast);
		}
		pendingPromise.then((action) => {
			try {
				if (!isMounted) return;
				if (action?.meta?.requestStatus === 'fulfilled') {
					setStatus('fulfilled');
				} else if (action?.meta?.requestStatus === 'rejected') {
					setStatus('rejected');
				} else {
					setStatus('fulfilled');
				}
			} catch (err) {
				if (isMounted) {
					setStatus('rejected');
				}
			}
		});
		isMounted = false;
	},[pendingPromise]);

	useEffect(()=>{
		if (!toastId.current) return;
		switch (status) {
		case 'pending':
			break;
		case 'fulfilled':
			toast.update(toastId.current, {
				...successToast,
				isLoading: false,
				render: <SuccessToast header={hSuccess} text={tSuccess}/>
			});
			break;
		case 'rejected':
			toast.update(toastId.current, {
				...errorToast,
				isLoading: false,
				render: <ErrorToast header={hError} text={tError} onClickButton={onClickErrButton}/>
			});
			break;
		default:
			break;
		}
	}, [status]);

	const getPendingBody = () => {
		return <div className={styles['container']}>
			<div className={styles['left']}>
				<h3 className={styles['header']}>{hPending}</h3>
			</div>
		</div>;
	};

	return <></>;
}