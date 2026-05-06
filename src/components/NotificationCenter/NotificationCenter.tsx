import React from 'react';
import cn from 'classnames';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { SLIDE_ANIMATION_TIME } from '../RollBox/RollBox';
import { NotificationCenterProps } from './NotificationCenter.props';
import styles from './NotificationCenter.module.css';
import { DefaultToast } from '../ToastNotificationItem/DefaultToast/DefaultToast';
import { ErrorToast } from '../ToastNotificationItem/ErrorToast/ErrorToast';
import { SuccessToast } from '../ToastNotificationItem/SuccessToast/SuccessToast';
import { WarningToast } from '../ToastNotificationItem/WarningToast/WarningToast';
import type { MissedToastItem } from '../../helpers/toastMissedTracker';
import { ignoreMissedReportsForMs, setMissedToastHandler } from '../../helpers/toastMissedTracker';
import { createPortal } from 'react-dom';

export function NotificationCenter({
	containerId,
	showClearButton = true,
	className,
	...rest
}: NotificationCenterProps) {
	const toastContainerId = containerId;

	const [hideLeft, setHideLeft] = React.useState<'hide-left'|'show-left'|'START'>('START');
	const [isOpen, setIsOpen] = React.useState(false);
	const [missedToasts, setMissedToasts] = React.useState<MissedToastItem[]>([]);
	const messagesEndRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		setMissedToastHandler((item) => {
			setMissedToasts((prev) => [...prev, item]);
		});
		return () => setMissedToastHandler(null);
	}, []);

	React.useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [missedToasts.length]);

	React.useEffect(() => {
		if (missedToasts.length !== 0) return;
		if (!isOpen && hideLeft === 'START') return;

		setIsOpen(false);
		setHideLeft('hide-left');
		setTimeout(() => {
			setHideLeft('START');
		}, SLIDE_ANIMATION_TIME);
	}, [missedToasts.length]);

	const handleOpenCloseButton = () => {
		if (missedToasts.length === 0) return;
		if (!isOpen) setIsOpen(true);
		else setIsOpen(false);
		if (hideLeft === 'START' || hideLeft === 'hide-left') {
			setHideLeft('show-left');
		} else {
			setHideLeft('hide-left');
			setTimeout(() => {
				setHideLeft('START');
			}, SLIDE_ANIMATION_TIME);
		}
	};

	const handleClear = () => {
		setMissedToasts([]);
		ignoreMissedReportsForMs();
		if (toastContainerId !== undefined) {
			toast.dismiss({ containerId: toastContainerId });
			return;
		}
		toast.dismiss();
	};

	const buttonIconSrc = (missedToasts.length === 0 || isOpen) ? '/notifications-unable.svg' : '/notifications.svg';

	return createPortal((
		<div className={cn(styles['box-wrapper'], className)} {...rest}>
			{/* ToastContainer не должен быть внутри .right с display:none — иначе закрытый вид "прячет" уведомления. */}
			<ToastContainer
				className={styles['toastify-shell']}
				position="top-left"
				hideProgressBar={false}
				pauseOnFocusLoss
				draggable
				newestOnTop={false}
				closeOnClick
				pauseOnHover
				transition={Slide}
				limit={50}
				{...(toastContainerId !== undefined ? { containerId: toastContainerId } : {})}
			/>

			<div className={cn(styles['left-buttons'], styles[hideLeft])}>
				<button
					className={cn(styles['button'], isOpen ? styles['open'] : '')}
					onClick={handleOpenCloseButton}
					disabled={missedToasts.length === 0}
				>
					<img src={buttonIconSrc} />
					{(!isOpen && missedToasts.length > 0) && (
						<div className={styles['popups-count']}>{missedToasts.length}</div>
					)}
				</button>
			</div>
			<div className={cn(styles['right'], styles[hideLeft])}>
				<div className={styles['scrollable']}>
					{missedToasts.map((t) => {
						const variantClass =
							t.variant === 'default' ? 'Toastify__toast--default' : `Toastify__toast--${t.variant}`;

						return (
							<div
								key={t.id}
								className={cn('Toastify__toast', variantClass, 'Toastify__toast-theme--colored', styles['missedToastItem'])}
							>
								{t.variant === 'success' && <SuccessToast header={t.header} text={t.text} />}
								{t.variant === 'warning' && (
									<WarningToast header={t.header} text={t.text} onClickButton={t.onClickButton} />
								)}
								{t.variant === 'error' && (
									<ErrorToast header={t.header} text={t.text} onClickButton={t.onClickButton} />
								)}
								{t.variant === 'default' && <DefaultToast header={t.header} text={t.text} />}
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
				<div className={styles['non-scrollable']}>
					{showClearButton && (
						<div className={styles['clear']} onClick={handleClear}>
							Очистить
						</div>
					)}
				</div>
			</div>
		</div>
	), document.body);
}