import { EditCustomPopupProps } from './EditCustomPopup.props';
import styles from './EditCustomPopup.module.css';
import popupStyles from '../EditTextPopup/EditTextPopup.module.css';
import cn from 'classnames';
import { useState } from 'react';

export function EditCustomPopup({children, header, wrapperCN, onCancel, onDelete, color, float = 'center', scrollable}: EditCustomPopupProps) {
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [isConfirmDelete, setConfirmDelete] = useState(false);

	const handleClickDelete = () => {
		if (!isConfirmDelete) {
			setConfirmDelete(!isConfirmDelete);
		}
	};

	const handleConfirmTrue = () => {
		if (isConfirmDelete && onDelete) {
			onDelete();
		}
	};

	const handleConfirmFalse = () => {
		setConfirmDelete(false);
	};

	const onMouseLeaveDelete = () => {
		if (isConfirmDelete) {
			setConfirmDelete(false);
		}
	};

	const onMouseEnterWrapper = () => {
		setIsHovering(true);
	};
	const onMouseLeaveWrapper = () => {
		setIsHovering(false);
	};
	const handleClickOutside = () => {
		if (!isHovering) onCancel();
	};

	return 	<div className={popupStyles['background']} onClick={handleClickOutside}>
		<div className={cn(popupStyles['wrapper'], styles[float], scrollable?popupStyles['scrollable']:'', 'big-shadow', color?popupStyles[color]:popupStyles['green'], wrapperCN)} onMouseEnter={onMouseEnterWrapper} onMouseLeave={onMouseLeaveWrapper}>
			<div className={popupStyles['header-wrap']}>
				<div className={cn(popupStyles['header'])}>
					{header}
				</div>
			</div>
			{onDelete && <button className={cn(styles['delete-btn'])} onClick={handleClickDelete} onMouseLeave={onMouseLeaveDelete}>
				{isConfirmDelete ? 'Точно?' : 'Удалить'}
				<img src='/x.svg' alt='delete' className={cn(styles['delete-img'], isConfirmDelete?styles['interactive']:'')} onClick={handleConfirmFalse}/>
				{isConfirmDelete && <img onClick={handleConfirmTrue} src='/more-white.svg' className={cn(isConfirmDelete?styles['interactive']:'', styles['save-img'])} alt='confirm'/> }
			</button>}
			<div className={popupStyles['content-wrapper']}>
				{children}
			</div>
			<div className={cn(popupStyles['buttons-line'], popupStyles['controls'])}>
				<button className={popupStyles['cancel-btn']} onClick={onCancel}>
					Назад
				</button>
			</div>
		</div>
	</div>;
}