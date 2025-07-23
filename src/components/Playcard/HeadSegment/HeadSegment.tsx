import { HeadSegmentProps } from './HeadSegment.props';
import styles from './HeadSegment.module.css';
import cn from 'classnames';
import { FC } from 'react';
import { TextInput } from '../../TextInput/TextInput';

export const HeadSegment: FC<HeadSegmentProps> = ({header, segmentId, segmentName, classNames, leftChildren, bottomChildren, active, groupable, onChangeHeader, ...props}) => {
	return <div id={segmentId} className={cn(styles['segment'], styles[segmentName], groupable? styles['groupable']:'', classNames)} data-active={active} {...props}>
		<div className={styles['left-content']}>
			{leftChildren}
		</div>
		<div className={cn(styles['right-content'], !leftChildren ? styles['header-center'] : '' )}>
			{onChangeHeader && <TextInput textCN={styles['header']} inputCN={styles['input']} wrapperCN={styles['input-wrapper']} buttonCN={styles['input-confirm']} initialText={header} onSave={onChangeHeader}/>}
			{!onChangeHeader && <div className={styles['header']}>
				{header}
			</div>}
			<div className={styles['bottom']}>
				{bottomChildren}
			</div>
		</div>
	</div>;
};