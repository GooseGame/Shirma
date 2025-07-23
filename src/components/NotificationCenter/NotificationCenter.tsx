import { NotificationCenterProps } from './NotificationCenter.props';
import styles from './NotificationCenter.module.css';
import { Popup } from '../Popup/Popup';
import { useEffect, useState } from 'react';
import React from 'react';
import { randomHash } from '../../helpers/random';
import { SLIDE_ANIMATION_TIME } from '../RollBox/RollBox';
import cn from 'classnames';

export function NotificationCenter({popups, remove, clear}: NotificationCenterProps) {
	const messagesEndRef = React.useRef<HTMLDivElement>(null);
	const [hideLeft, setHideLeft] = useState<'hide-left'|'show-left'|'START'>('START');
	const [isOpen, setIsOpen] = useState(false);

	const scrollBottom = () => {
		const {current} = messagesEndRef;
		if (current !== null) {
			current.scrollIntoView({behavior: 'smooth'});
		}
	};
	useEffect(()=>{
		scrollBottom();
	}, [popups]);

	const handleOpenCloseButton = () => {
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

	if (popups.length === 0) return <></>;
	return <div className={cn(styles['box-wrapper'])}>
		<div className={cn(styles['left-buttons'], styles[hideLeft])}>
			<button className={cn(styles['button'], isOpen ? styles['open']:'')} onClick={handleOpenCloseButton}>
				<img src={isOpen ? '/notifications-unable.svg' : '/notifications.svg'}/>
				{(popups.length > 0 && !isOpen) && 
					<div className={styles['popups-count']}>{popups.length}</div>
				}
			</button>
		</div>
		<div className={cn(styles['right'], styles[hideLeft])}>
			<div className={styles['scrollable']}>
				{popups.map(popup => (
					<Popup {...popup} key={randomHash()} closePopup={remove}/>
				))}
				<div ref={messagesEndRef}></div>
			</div>
			<div className={styles['non-scrollable']}>
				<div className={styles['clear']} onClick={clear}>
					Очистить
				</div>
			</div>
		</div>
	</div>;
}