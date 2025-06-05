 
import { RichTextProps } from './RichText.props';
import styles from './RichText.module.css';
import { Image, Link, Word } from '../../interfaces/Text.interface';
import { ReactNode } from 'react';
import cn from 'classnames';
import { Eye } from '../Eye/Eye';
import { randomHash } from '../../helpers/random';

export function RichText({text, classNames, eyesRight}: RichTextProps) {
	const getElementByWordType = (el: Word|Link|Image): ReactNode => {
		const key = randomHash();
		if (el.type === 'word' ) {
			return el.style === 'hidden' ? 
				<Eye key={key} text={el.word} floatRight={eyesRight}/> : 
				<span key={key} className={cn(styles['text'], styles[el.style])}>
					{el.word}
				</span>;
		}
		if (el.type === 'image') {
			return <img 
				src={el.src} 
				alt={el.alt} 
				key={key}
				className={(!el.height && !el.width) ? cn(styles['img'], styles['default-img']) : styles['img']}
				style={(el.height && el.width) ? {
					height: `${el.height}px`,
					width: `${el.width}px`
				} : undefined}
			/>;
		}
		if (el.type === 'link') {
			return <a key={key} href={el.to} target="_blank" className={cn(styles['link'], styles[el.style])}>{el.word}</a>;
		}
		return <></>;
	};
	return <div className={cn(styles['text-content'], classNames)}>
		{text.text.map(paragraph => (
			<div key={randomHash()} className={styles['paragraph']}>
				{paragraph.paragraph.map(el => (
					getElementByWordType(el)
				))}
			</div>
		))}
	</div>;
}