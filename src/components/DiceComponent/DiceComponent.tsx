import { DiceComponentProps } from './DiceComponent.props';
import styles from './DiceComponent.module.css';
import cn from 'classnames';

export function DiceComponent({dice, diceValue, classNames, animate = false, ...props}: DiceComponentProps) {
	const src = `/d${dice.edge}.svg`;
	const alt = `d${dice.edge} dice`;
	return <div className={cn(styles['dice-wrapper'], styles[`d${dice.edge}`], classNames)} {...props}>
		<img className={styles['dice-img']} src={src} alt={alt}/>
		<span className={styles['dice-value']}>{diceValue}</span>
		{animate && <img src='/dice-animate.gif' className={styles['animate']} alt='animation'/>}
	</div>;
}