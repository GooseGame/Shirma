import { EyeProps } from './Eye.props';
import styles from './Eye.module.css';
import cn from 'classnames';

export function Eye({text, floatRight, size = 'normal', white, ElementIstead, offsetHint, classNames, hintCN}: EyeProps) {
	const onMouseOverHiddenText = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		const textToShow = e.currentTarget.lastElementChild;
		const offset = offsetHint ? offsetHint : 15;
		if (textToShow) {
			textToShow.setAttribute('style', 'top: '+(e.currentTarget.offsetTop+offset)+'px');
		}
	};
	return <div className={cn(styles['hidden-content'], floatRight ? styles['right']:'', classNames)} onMouseOver={onMouseOverHiddenText}>
		{ElementIstead}
		{!ElementIstead && <img src={white ? '/eye-white.svg' : '/eye.svg'} alt='eye' className={cn(styles['hidden-text-icon'], styles[size])}/>}
		<div className={cn(styles['hidden'], hintCN, 'big-shadow')}>{text}</div>
	</div>;
}