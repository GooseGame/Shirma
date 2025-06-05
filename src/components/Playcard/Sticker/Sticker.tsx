/* eslint-disable no-mixed-spaces-and-tabs */
import { StickerProps } from './Sticker.props';
import styles from './Sticker.module.css';
import { RoundButton } from '../../Button/Button';
import { Icon } from '../../Icons/Icon';
import cn from 'classnames';
import { RichText } from '../../RichText/RichText';

export function Sticker({width, fullHeight, scrollable, header, afterHeaderEl, hasAddButton, bodyContent, stickerCN, bodyCN, headerCN, eyesRight, onClickAddButton, stickerStyle = 'paper', ...props}: StickerProps) {
	const widthMap = () => {
		if (width === 0.25) return styles['half-half'];
		if (width === 0.5) return styles['half'];
		return	styles['one-of-three'];
	};
	return <div className={
		cn(
			styles['sticker'], 
			widthMap(),
			fullHeight ? styles['full-height'] : styles['dynamic-height'],
			(scrollable && bodyContent.type === 'list') ? styles['scrollable'] : '',
			stickerCN,
			styles[stickerStyle],
			stickerStyle !== 'box' ? 'big-shadow' : ''
		)
	} {...props}>
		<div className={styles['header-area']}>
			{header && <h2 className={cn(styles['header'], headerCN)}>{header}</h2>}
			{afterHeaderEl}
			{hasAddButton && 
                <RoundButton isRed={true} classNames={styles['add-btn']} onClick={onClickAddButton}>
                	<Icon src="/plus.svg" alt='add' classNames={'plus-icon'}/>
                </RoundButton>
			}
		</div>
		{bodyContent.type === 'text' && <RichText text={bodyContent} eyesRight={eyesRight} classNames={cn(scrollable ? styles['scrollable'] : '', bodyCN)}/>}
		{bodyContent.type === 'list' && bodyContent.children}
	</div>;
}