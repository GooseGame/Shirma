import { CalcButoonProps } from './CalcButton.props';
import styles from './CalcButton.module.css';
import cn from 'classnames';

export function CalcButton({children, onClickAction, buttonCN, width}: CalcButoonProps) {
	const getStyleByWidth = () => {
		switch (width) {
		case 1:
			return 'slim';
		case 2:
			return 'wide';
		case 3:
			return 'chonky';
		}
	};
	return <button 
		onClick={onClickAction} 
		className={cn(styles['button'], buttonCN, 'small-shadow', styles[getStyleByWidth()])}
	>
		{children}
	</button>;
}