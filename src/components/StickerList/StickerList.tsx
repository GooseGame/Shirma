import styles from './StickerList.module.css';
import cn from 'classnames';
import { StickerListProps } from './StickerList.props';
import { useState } from 'react';

export function StickerList({headCN, descriptionCN, header, desc, listStyle = 'paper', afterHeaderEl}: StickerListProps) {
	const [isOpen, setIsOpen] = useState(false);
	const emptyDesc = (desc.type === 'word' && desc.children.length === 0);
	const handleOpenButton = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsOpen(!isOpen);
	};

	return <div className={styles['list-wrapper']}>
		<div className={cn(styles['header-area'], styles[listStyle], headCN)}  onClick={handleOpenButton}>
			<h2 className={cn(styles['header'], (emptyDesc && listStyle === 'paper') ? styles['disabled'] : '', styles[listStyle])}>
				{header}
			</h2>
			{afterHeaderEl}
			{!(emptyDesc && listStyle === 'paper') && <div className={cn(styles['arrow-wrapper'], styles[listStyle])}>
				<img src={listStyle === 'paper' ? '/more.svg': '/more-white.svg'} className={cn(styles['arrow'], isOpen ? styles['open']: '')} alt='show more'/>
			</div>}
		</div>
		<div className={cn(styles['description'], isOpen?styles['open']:'', styles[listStyle], descriptionCN)}>
			{desc.type === 'word' && desc.children.map((el, index) => (
				<div key={`${el.word}-${index}`} className={cn(styles['desc-item'], styles[listStyle])}>
					{el.word}
				</div>
			))}
			{desc.type === 'node' && desc.childrem}
		</div>
	</div>;
}