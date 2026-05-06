import { Id, toast } from 'react-toastify';
import { PendingToastProps } from './PendingToast.props';
import { ErrorToast } from '../ErrorToast/ErrorToast';
import { SuccessToast } from '../SuccessToast/SuccessToast';
import { errorToast, pendingToast, successToast } from '../../../helpers/toastOptions';
import styles from './../ToastNotificationItem.module.css';
import { randomHash } from '../../../helpers/random';
import { reportMissedToast } from '../../../helpers/toastMissedTracker';

export function pendingToastCall({pendingPromise, headerPending, headerSuccess, headerError, textError, textSuccess, onClickErrButton}: PendingToastProps) {
	const hError = headerError ?? 'Ошибка';
	const hPending = headerPending ?? 'Загрузка...';
	const hSuccess = headerSuccess ?? 'Успешно';
	const tSuccess = textSuccess ?? '';
	const tErrorDefault = textError ?? '';

	const toastId: Id = toast.loading(
		<div className={styles['container']}>
			<div className={styles['left']}>
				<h3 className={styles['header']}>{hPending}</h3>
			</div>
		</div>,
		pendingToast
	);

	pendingPromise
		.then(() => {
			const missedId = randomHash();
			toast.update(toastId, {
				...successToast,
				isLoading: false,
				render: <SuccessToast header={hSuccess} text={tSuccess} />,
				onClose: (reason) => {
					if (reason === true) return;
					reportMissedToast({ id: missedId, variant: 'success', header: hSuccess, text: tSuccess });
				}
			});
		})
		.catch((err) => {
			const missedId = randomHash();
			const errText =
				(typeof err === 'object' && err && 'message' in err && typeof (err as any).message === 'string')
					? (err as any).message
					: tErrorDefault;
			toast.update(toastId, {
				...errorToast,
				isLoading: false,
				render: <ErrorToast header={hError} text={errText || tErrorDefault} onClickButton={onClickErrButton} />,
				onClose: (reason) => {
					if (reason === true) return;
					reportMissedToast({
						id: missedId,
						variant: 'error',
						header: hError,
						text: errText || tErrorDefault,
						onClickButton: onClickErrButton
					});
				}
			});
		});

	return toastId;
}