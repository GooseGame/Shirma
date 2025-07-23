import { FC, useState } from 'react';
import styles from './MenuMobile.module.css';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { RoundButton } from '../Button/Button';
import { Icon } from '../Icons/Icon';
import { SLIDE_ANIMATION_TIME } from '../RollBox/RollBox';

export const MenuMobile: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const onClickNewCharacter = () => {
		navigate('/character/new');
	};

	const [hideLeft, setHideLeft] = useState<'hide-left'|'show-left'|'START'>('START');

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


	return <div className={styles['box-wrapper']}>
		<div className={cn(styles['left-buttons'], styles[hideLeft])}>
			<button className={cn('small-shadow', styles['button'], isOpen ? styles['open']:'')} onClick={handleOpenCloseButton}>
				<img src={isOpen ? '/x.svg' : '/burger.svg'}/>
			</button>
		</div>
		<div className={cn(styles['right'], styles[hideLeft])}>
			<div className={styles['right-wrapper']}>
				<h1 className={styles['header-logo']}>Ширма</h1>
				<div className={styles['list-item-wrapper']}>
					<a href='/characters' className={styles['page-header']}>Персонажи</a>
					<RoundButton isRed={true} onClick={onClickNewCharacter}>
						<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
					</RoundButton>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Справочник</h2>
					<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
						<RoundButton isRed={true} classNames={styles['unable-btn']}>
							<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
						</RoundButton>
					</div>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Монстры</h2>
					<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
						<RoundButton isRed={true} classNames={styles['unable-btn']}>
							<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
						</RoundButton>
					</div>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Сгенерируй имя</h2>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Бой</h2>
					<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
						<RoundButton isRed={true} classNames={styles['unable-btn']}>
							<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
						</RoundButton>
					</div>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Лут</h2>
					<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
						<RoundButton isRed={true}  classNames={styles['unable-btn']}>
							<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
						</RoundButton>
					</div>
				</div>
				<div className={cn(styles['list-item-wrapper'], styles['unable-wrapper'])} title={'когда-нибудь'}>
					<h2 className={cn(styles['page-header'], styles['unable'])}>Комнаты</h2>
					<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
						<RoundButton isRed={true} classNames={styles['unable-btn']}>
							<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
						</RoundButton>
					</div>
				</div>
			</div>
		</div>
	</div>;
};