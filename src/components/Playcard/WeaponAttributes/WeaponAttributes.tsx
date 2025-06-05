import { WeaponAttributesProps } from './WeaponAttributes.props';
import styles from './WeaponAttributes.module.css';
import { ATTRIBUTE_UNIVERSAL } from '../../../helpers/attributes';
import cn from 'classnames';

export function WeaponAttributes({info, size = 'medium', ...props}: WeaponAttributesProps) {
	return <div className={cn(styles['attribute'], styles[size], info.type === 'damage' ? 'small-shadow' : '')} {...props} style={{backgroundColor: info.bgColor, color: info.color}}>
		{info.type === 'distance' && 
			<>
				<span className={cn(styles['text'], styles[size])}>{info.distance}</span>
				<img src='/slash.svg' alt='slash' className={styles['img']}/>
				<span className={cn(styles['text'], styles[size])}>{info.maxDistance}</span>
			</>
		}
		{
			info.type === 'damage' &&
			<>
				<span className={cn(styles['text'], styles[size])}>{info.value.count}к{info.value.edge}</span>
				{info.modifiers !== 0 &&
					<span className={cn(styles['text'], styles[size])}>
						{info.modifiers > 0 ? `+${info.modifiers}` : `-${info.modifiers}`}
					</span>
				}
				<div className={cn(styles['wrap'], styles[size])}><img src={info.img} alt={info.name} className={cn(styles['img'], styles[size])}/></div>
			</>
		}
		{
			info.type === 'attribute' &&
			<>
				{info.id === ATTRIBUTE_UNIVERSAL && 
				<>
					<div className={cn(styles['wrap'], styles[size])}><img src='/1-hand.svg' alt='one hand' className={cn(styles['img'], styles[size])}/></div>
					<img src='/slash.svg' alt='slash' className={cn(styles['img'], styles[size])}/>
					<div className={cn(styles['wrap'], styles[size])}><img src='/2-hand.svg' alt='or two hand' className={cn(styles['img'], styles[size])}/></div>
				</>
				}
				{info.id !== ATTRIBUTE_UNIVERSAL && 
				<>
					<div className={cn(styles['wrap'], styles[size])}><img src={info.img} alt={info.name} className={cn(styles['img'], styles[size])}/></div>
				</>
				}
			</>
		}
	</div>;
}