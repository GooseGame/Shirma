import { FC } from 'react';
import styles from './Header.module.css';
import { RoundButton } from '../Button/Button';
import { Icon } from '../Icons/Icon';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';

export const Header: FC = ({...props }) => {
	const navigate = useNavigate();
	const onClickNewCharacter = () => {
		navigate('/character/new');
	};
	

	return <div className={styles['header-area']}>
		<h1 className={styles['header-logo']} {...props}>Ширма</h1>
		<div className={styles['page-container']}>
			<a href='/characters' className={styles['page-header']}>Персонажи</a>
			<div className={styles['add-icon-wrapper']}>
				<RoundButton isRed={true} onClick={onClickNewCharacter}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Справочник</h2>
			<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
				<RoundButton isRed={true} classNames={styles['unable-btn']}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Монстры</h2>
			<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
				<RoundButton isRed={true} classNames={styles['unable-btn']}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Сгенерируй имя</h2>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Бой</h2>
			<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
				<RoundButton isRed={true} classNames={styles['unable-btn']}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Лут</h2>
			<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
				<RoundButton isRed={true}  classNames={styles['unable-btn']}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
		<div className={cn(styles['page-container'], styles['unable-wrapper'])} title={'когда-нибудь'}>
			<h2 className={cn(styles['page-header'], styles['unable'])}>Комнаты</h2>
			<div className={cn(styles['add-icon-wrapper'], styles['unable'])}>
				<RoundButton isRed={true} classNames={styles['unable-btn']}>
					<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
				</RoundButton>
			</div>
		</div>
	</div>;
};