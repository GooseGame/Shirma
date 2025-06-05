import { NotificationCenterProps } from './NotificationCenter.props';
import styles from './NotificationCenter.module.css';
import { Popup } from '../Popup/Popup';
import { useEffect } from 'react';
import React from 'react';
import { randomHash } from '../../helpers/random';

export function NotificationCenter({popups, remove, clear}: NotificationCenterProps) {
	const messagesEndRef = React.useRef<HTMLDivElement>(null);
	const scrollBottom = () => {
		const {current} = messagesEndRef;
		if (current !== null) {
			current.scrollIntoView({behavior: 'smooth'});
		}
	};
	useEffect(()=>{
		scrollBottom();
	}, [popups]);

	if (popups.length === 0) return <></>;
	return <div className={styles['popups-wrapper']}>
		<div className={styles['clear']} onClick={clear}>
			Очистить
		</div>
		<div className={styles['popups']}>
			{popups.map(popup => (
				<Popup {...popup} key={randomHash()} closePopup={remove}/>
			))}
			<div ref={messagesEndRef}></div>
		</div>
	</div>;
}