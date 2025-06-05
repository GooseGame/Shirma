import { EquipmentProps } from './Equipment.props';
import styles from './Equipment.module.css';
import cn from 'classnames';
import { Eye } from '../../Eye/Eye';

export function Equipment({item, classNames, size='medium', onClickMore, onClickLess, onClickDelete, onClickText}: EquipmentProps) {
	return <div className={cn(styles['item'], classNames)}>
		<div className={styles['left']}>
			<span className={cn(styles['name'], styles[size])} onClick={onClickText}>{item.name}</span>
			{item.description && 
            <Eye text={item.description} white/>}
		</div>
		<div className={styles['right']}>
			{item.weight && <div className={styles['weight-wrapper']}>
				<div className={cn(styles['control'], styles[size])}>
					<img src='/weight.svg' className={cn(styles['control-img'], styles[size])} alt='weight'/>
				</div>
				<div className={cn(styles['weight'], styles['right-text'])}>
					{`${item.weight}`}
				</div>
			</div>}
			<div className={styles['counter']}>
				<button className={cn(styles['control'], styles[size])} onClick={onClickLess}>
					<img className={cn(styles['control-img'], styles[size])} src='/minus.svg' alt='less'/>
				</button>
				<div className={styles['right-text']}>
					{item.count}
				</div>
				<button className={cn(styles['control'], styles[size])} onClick={onClickMore}>
					<img className={cn(styles['control-img'], styles[size])} src='/plus.svg' alt='more'/>
				</button>
			</div>
			<button className={cn(styles['control'], styles['red'], styles[size])} onClick={onClickDelete}>
				<img className={cn(styles['control-img'], styles[size])} src='/x-red.svg' alt='clear'/>
			</button>
		</div>
	</div>;
}