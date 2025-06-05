import { MiniCardProps } from './MiniCard.props';
import styles from './MiniCard.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useMouse } from '@uidotdev/usehooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getClassByClassname } from '../../helpers/createCharacter';

export function MiniCard({creature, deleteAction, cloneAction}: MiniCardProps) {
	const getRarity = () => {
		if (creature.info.level < 5) return 'common';
		if (creature.info.level < 10) return 'uncommon';
		if (creature.info.level < 15) return 'rare';
		return 'legendary';
	};
	const isMaxHP = creature.condition.health.current === creature.condition.health.max;
	const hasExtraHP = creature.condition.health.extra > 0;
	const [currentTarget, setCurrentTarget] = useState<EventTarget & Element>();
	const [animate, setAnimate] = useState(false);
	const [mouse] = useMouse();
	let angleX = 0;
	let angleY = 0;
	const specRef = React.createRef<HTMLDivElement>();
	const maskRef = React.createRef<HTMLDivElement>();
	const rarity = getRarity();
	const navigate = useNavigate();
	const [isConfirmDelete, setConfirmDelete] = useState(false);
	const creatureClass = getClassByClassname(creature.info.class.name);

	const handleClickMiniCard = () => {
		navigate(`/character/${creature.id}`);
	};

	const handleClickDelete = () => {
		if (!isConfirmDelete) {
			setConfirmDelete(!isConfirmDelete);
		}
	};

	const onMouseLeaveDelete = () => {
		if (isConfirmDelete) {
			setConfirmDelete(false);
		}
	};

	const handleConfirmFalse = () => {
		setConfirmDelete(false);
	};

	const handleConfirmTrue = () => {
		if (isConfirmDelete) {
			deleteAction(creature.id);
		}
	};

	useEffect(()=>{
		if (currentTarget && animate) {
			const elRect = currentTarget.getBoundingClientRect();
			const centerX = elRect.x + (elRect.width/2);
			const centerY = elRect.y + (elRect.height/2);
			angleX = getAngle(mouse.x, centerX);
			angleY = getAngle(mouse.y, centerY);
			const distanceY = getDistance(mouse.y, centerY);
			const percent = distanceY / (elRect.height/2);
			currentTarget.setAttribute('style', `transform: rotateY(${-angleX}deg) rotateX(${angleY}deg)`);
			specRef.current?.setAttribute('style', `top: ${30 - percent*100}%`);
		}
	}, [mouse]);
	const handleBalatro = (e: React.MouseEvent) => {
		e.preventDefault();
		setAnimate(true);
		setCurrentTarget(e.currentTarget);
	};

	const resetBalatro = (e: React.MouseEvent) => {
		if (e.currentTarget.firstElementChild) {
			const resetTarget = e.currentTarget.firstElementChild;
			setTimeout(()=>{resetTarget.setAttribute('style', '');},1);
			if (rarity === 'common') {
				specRef.current?.setAttribute('style', 'top: -50%');
				maskRef.current?.setAttribute('style', 'top: 25%');
			} else {
				specRef.current?.setAttribute('style', 'top: 0');
			}
		}
		setAnimate(false);
		setCurrentTarget(undefined);
		console.log('clear');
		
		
	};

	const getDistance = (clientCoordinate: number, centerCoordinate: number) => {
		return (clientCoordinate > centerCoordinate) ? clientCoordinate - centerCoordinate : centerCoordinate - clientCoordinate;
	};

	const getAngle = (clientCoordinate: number, centerCoordinate: number) => {
		const aSq = getDistance(clientCoordinate, centerCoordinate);
		const bSq = 300;
		const angle = Math.atan(aSq/bSq) * 180 / Math.PI;
		return clientCoordinate > centerCoordinate ? angle : 360 - angle;
	};

	return <div className={cn(styles['mini-card-wrapper'])}>
		<div onClick={handleClickMiniCard} className={cn(styles['playcard-wrapper'], styles[rarity], styles[creatureClass])} onMouseLeave={resetBalatro}>
			<div className={styles['playcard-mini']} onMouseEnter={handleBalatro}>
				{rarity === 'uncommon' && <div className={cn(styles['unc-wrap'], styles[`unc-${creatureClass}`])}></div>}
				<div className={styles['top-container']}>
					<div className={cn(styles[`${rarity}-info`], styles['rarity'])}>
						{rarity !== 'legendary' && <img src={`/${rarity}.png`} className={styles['rarity-img']}/>}
						{rarity === 'legendary' && 
							<img src={(creatureClass !== 'default') ? `/legendary-d20-${creatureClass}.svg`: '/legendary-d20.svg'} className={styles['rarity-img']}/>
						}
					</div>
					<h2 className={styles['header']}>{creature.info.name}</h2>
					<div className={styles['mid']}>
						<img className={styles['avatar']} src={creature.avatar} alt='avatar'/>
						{rarity === 'common' && <div className={cn(styles['shader__layer'], styles['specular'])} ref={specRef}>
							<div className={cn(styles['shader__layer'], styles['mask'])} ref={maskRef}></div>
						</div>}
					</div>
				</div>
				<div className={styles['bottom']}>
					<div className={cn(styles['line'], styles[`top-${rarity}`])}>
						<div className={styles['health']}>
							{!isMaxHP && <span className={cn(styles['red'], styles['small'])}>{creature.condition.health.current}/</span>}
							<span className={cn(styles['max'], styles['black'])}>{creature.condition.health.max}</span>
							{hasExtraHP && <span className={cn(styles['small'], styles['blue'])}>({creature.condition.health.extra})</span>}
						</div>
						<div className={cn(styles['level'], styles['max'])}>
							{creature.info.level}ур
						</div>
					</div>
					<div className={cn(styles['line'], styles[`bottom-${rarity}`])}>
						<div className={styles['class-race']}>
							{creature.info.class.name+' - '+creature.info.race}
						</div>
						<div className={styles['right-btns']}>
							<div className={cn(styles['mini-btn'], styles['kd'], styles['black'])}>
								{creature.condition.armor}кд
							</div>
							<div className={cn(styles['mini-btn'], styles['alignment'])}>
								{creature.info.alignmentShort}
							</div>
						</div>
					</div>
				</div>
				{rarity !== 'common' && <div className={styles['effects']}>
					<div className={styles[`spec-${rarity}`]} ref={specRef}>
					</div>
					{rarity !== 'legendary' && 
						<div className={styles[`mask-${rarity}`]} ref={maskRef}>
						</div>
					}
				</div>}
			</div>
		</div>
		<div className={styles['bottom-controls']} onMouseLeave={onMouseLeaveDelete}>
			<div onClick={()=>cloneAction(creature)} className={cn(styles['bottom-btn'], styles['bottom-clone'], 'small-shadow')}>
				Клонировать
				<img src='/clone.svg' className={styles['bottom-img']} alt='clone'/>
			</div>
			<div className={cn(styles['bottom-btn'], styles['bottom-delete'], 'small-shadow')} onClick={handleClickDelete}>
				{isConfirmDelete ? 'Точно?' : 'Удалить'}
				<img src='/x.svg' className={cn(isConfirmDelete?styles['bottom-interactive']:'', styles['bottom-img'])} alt='delete' onClick={handleConfirmFalse}/>
				{isConfirmDelete && <img onClick={handleConfirmTrue} src='/more-white.svg' className={cn(isConfirmDelete?styles['bottom-interactive']:'', styles['confirm-delete'], styles['bottom-img'])} alt='confirm'/> }
			</div>
		</div>
	</div>;
}