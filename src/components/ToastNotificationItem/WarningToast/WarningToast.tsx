import styles from './../ToastNotificationItem.module.css';
import { WarningToastProps } from './WarningToast.props';
import cn from 'classnames';

export function WarningToast({header, text, onClickButton}: WarningToastProps)
{
	return <div className={styles['container']}>
		<div className={styles['left']}>
			<h3 className={styles['header']}>{header}</h3>
			<div className={styles['text']}>{text}</div>
		</div>
		{onClickButton &&
			<div className={cn(styles['right'], styles['right-warning'])}>
				{onClickButton}
			</div>
		}
	</div>;
}