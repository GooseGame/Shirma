import { PopupProps } from './Popup.props';
import styles from './Popup.module.css';
import { RoundButton } from '../Button/Button';
import cn from 'classnames';

export function Popup({popupid, header, text, isShow, closePopup, classNames}: PopupProps) {
	const handleExitPopup = () => {
		if (closePopup) closePopup(popupid);
	};

	if (!isShow) return <></>;
	return <div className={cn(styles['content'], 'small-shadow', classNames)}>
		<RoundButton className={cn(styles['exit'], 'small-shadow')} onClick={handleExitPopup}>
			<img src='/x.svg' alt='close'/>
		</RoundButton>
		<h2 className={styles['header']}>{header}</h2>
		<span className={styles['text']}>{text}</span>
	</div>;
}