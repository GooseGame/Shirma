import styles from './../ToastNotificationItem.module.css';
import { ErrorToastProps } from './ErrorToast.props';
import cn from 'classnames';

export function ErrorToast({header, text, onClickButton}: ErrorToastProps)
{
	return <div className={styles['container']}>
		<div className={styles['left']}>
			<h3 className={styles['header']}>{header}</h3>
			<div className={styles['text']}>{text}</div>
		</div>
		{onClickButton &&
			<div className={cn(styles['right'], styles['right-error'])}>
				{onClickButton}
			</div>
		}
	</div>;
}