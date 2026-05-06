import styles from './../ToastNotificationItem.module.css';
import { DefaultToastProps } from './DefaultToast.props';

export function DefaultToast({header, text}: DefaultToastProps)
{
	return <div className={styles['container']}>
		<div className={styles['left']}>
			<h3 className={styles['header']}>{header}</h3>
			<div className={styles['text']}>{text}</div>
		</div>
	</div>;
}