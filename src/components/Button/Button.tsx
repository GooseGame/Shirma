import { RoundButtonProps, SquareButtonProps, TextButtonProps } from './Button.props';
import { FC } from 'react';
import styles from './Button.module.css';
import cn from 'classnames';

export const RoundButton: FC<RoundButtonProps> = ({ children, classNames, size = '30', isRed = false, ...props }) => {
	return (
		<button className={cn(
			'small-shadow', 
			isRed ? styles['red-btn'] : '', 
			styles['size'+size], 
			styles['round-btn'], 
			styles['btn'], 
			classNames
		)} {...props}>{children}</button>
	);
};

export const SquareButton: FC<SquareButtonProps> = ({ children, classNames, isBigShadow = true, ...props }) => {
	return (
		<button className={cn(isBigShadow ? 'big-shadow' : 'small-shadow', styles['square-btn'], styles['btn'], classNames)} {...props}>{children}</button>
	);
};

export const TextButton: FC<TextButtonProps> = ({ classNames, text, ...props }) => {
	return (
		<button className={cn(styles['text-btn'], styles['btn'], classNames)} {...props}>{text}</button>
	);
};

