import { WeaponItemProps } from './WeaponItem.props';
import styles from './WeaponItem.module.css';
import { ATTRIBUTE_DISTANCE, distanceExtendedPreset, getAttributeById, getDamageById } from '../../../helpers/attributes';
import { WeaponAttributes } from '../WeaponAttributes/WeaponAttributes';
import { DistanceExtended } from '../../../interfaces/Equipment.interface';
import { Eye } from '../../Eye/Eye';
import cn from 'classnames';
import { useState } from 'react';

export function WeaponItem({weapon, aimMod, setAimRoll, setDmgRoll, onClickName, onClickDelete}: WeaponItemProps) {	
	const distanceExtendetAttr = weapon.attributes.find(dist => dist.id === ATTRIBUTE_DISTANCE);
	const distanceExtended = distanceExtendetAttr ? 
		{...distanceExtendetAttr, ...distanceExtendedPreset} as DistanceExtended :
		undefined;
	const [isConfirm, setIsConfirm] = useState(false);

	const confirmOrDelete = () => {
		if (isConfirm) {
			if (onClickDelete) onClickDelete();
		} else {
			setIsConfirm(true);
		}
	};
	
	return <div className={cn(styles['line'], 'small-shadow')}>
		<div className={styles['name-distance']} onMouseLeave={()=>setIsConfirm(false)}>
			{distanceExtended && 
			<div className={styles['distance-info']}>
				<Eye 
					key={`distance-${distanceExtended.distance}-${distanceExtended.maxDistance}`} 
					offsetHint={40} 
					text={distanceExtended.desc} 
					ElementIstead={
						<WeaponAttributes size='small' info={distanceExtended}/>
					}
				/>
			</div>}
			<span onClick={onClickName} className={styles['name']}>
				{weapon.name}
			</span>
			<div className={cn(styles['delete-btn'], 'small-shadow')} onClick={confirmOrDelete}>
				{!isConfirm && <img src='/x.svg' alt='delete' className={styles['delete-weapon-icon']}/>}
				{isConfirm && <img src='/more-white.svg' alt='really delete' className={styles['confirm-delete']}/>}
			</div>
		</div>
		<div className={styles['mid-info-wrapper']}>
			<div className={styles['scrollable-mid']}>
				<span className={styles['mid-info-text']}>
					Урон:
				</span>
				{weapon.damage.map((dmg, index) => {
					const dmgTypeExtended = getDamageById(dmg.typeId);
					if (dmgTypeExtended) return <Eye key={`${weapon.name}-${dmg.typeId}-${index}`} offsetHint={40} text={dmgTypeExtended.desc} ElementIstead={
						<WeaponAttributes size='small' info={
							{
								...dmg,
								...dmgTypeExtended
							}
						}/>
					}/>;
				})}
			</div>
		</div>
		<div className={cn(styles['mid-info-wrapper'], styles['attributes-wrapper'])}>
			<div className={styles['scrollable-mid']}>
				<span className={styles['mid-info-text']}>
					Атрибуты:
				</span>
				{weapon.attributes.map((attr, index) => {
					if (attr.id !== ATTRIBUTE_DISTANCE) {
						const attrExtended = getAttributeById(attr.id);
						if (attrExtended) return <Eye key={`${attr.id}-${index}`}  offsetHint={35} text={attrExtended.desc} ElementIstead={
							<WeaponAttributes size='small' info={attrExtended}/>
						}/>;
					}
				})}
			</div>
		</div>
		<div className={styles['bottom']}>
			<div onClick={()=>setAimRoll(aimMod)} className={cn(styles['btn'], weapon.isProf ? styles['prof'] : styles['non-prof'], 'small-shadow')}>
				<span className={cn(styles['text'], weapon.isProf ? styles['prof'] : styles['non-prof'])}>
					{aimMod >= 0 ? `+${aimMod}` : `-${aimMod}`}
				</span>
				<img className={styles['aim-img']} src={!weapon.isProf ? '/aim.svg' : '/aim-white.svg'} alt='aim'/>
			</div>
			<div onClick={()=>setDmgRoll(weapon.damage)} className={cn(styles['btn'], styles['roll'], 'small-shadow')}>
				<img src='/d20.svg' alt='roll' className={styles['aim-img']}/>
			</div>
		</div>
	</div>;
}