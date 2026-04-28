import { FC } from 'react';
import styles from './Header.module.css';
import { RoundButton } from '../Button/Button';
import { Icon } from '../Icons/Icon';
import cn from 'classnames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { getClassByClassname } from '../../helpers/createCharacter';

export const Header: FC = ({...props }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const showProfileLink = location.pathname === '/characters' || /^\/character\/[^/]+$/.test(location.pathname);
	const nickName = useSelector((s: RootState) => s.user.users.name);
	const characters = useSelector((s: RootState) => s.characters.characters);
	const characterId = /^\/character\/([^/]+)$/.exec(location.pathname)?.[1];
	const currentCharacterClass = characterId
		? characters.find((ch) => ch.id === characterId)?.info.class.name
		: undefined;
	const userIconName = currentCharacterClass ? getClassByClassname(currentCharacterClass) : 'default';
	const userIconSrc = `/${userIconName}-user.svg`;

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
		{showProfileLink && (
			<div className={styles['profile-link-wrapper']}>
				<Link to='/user/edit' className={styles['profile-link']}>
					<span className={styles['profile-name']}>{nickName}</span>
					<img src={userIconSrc} alt='user icon' className={styles['profile-icon']} />
				</Link>
			</div>
		)}
	</div>;
};