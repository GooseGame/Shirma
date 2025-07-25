import { useEffect, useRef, useState } from 'react';
import styles from './EditTextPopup.module.css';
import { EditTextPopupProps } from './EditTextPopup.props';
import { parseReverse, parseText } from './EditTextPopup.parser';
import cn from 'classnames';
import useScreenWidth from '../../helpers/hooks/useScreenWidth';


export function EditTextPopup({editValue, header, onSave, onCancel, color, onSaveWithHeader, onDelete, wrapperCN, children, textareaCN}: EditTextPopupProps) {
	const [text, setText] = useState<string>('');
	const [selection, setSelection] = useState<string>('');
	const [isTextareaFocused, setTextareaFocused] = useState<boolean>(false);
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const [changedHeader, setChangedHeader] = useState(header);
	const [isEditHeader, setIsEditHeader] = useState(false);
	const [isConfirmDelete, setConfirmDelete] = useState(false);
	const screenWidth = useScreenWidth();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const linkTemplate = 			'|url(to=ссылка&word=#text#';
	const wordTemplate = 			'|word(word=#text#';
	const boldStyleTemplate = 		'style=bold';
	const italicStyleTemplate = 	'style=italic';
	const underlineStyleTemplate = 	'style=underline';
	const overlineTemplate = 		'style=overline';
	const normalTemplate = 			'style=normal';
	const hiddenStyleTemplate = 	'style=hidden';

	useEffect(()=>{
		if (editValue) {
			setText(parseReverse(editValue));
		}
	}, [editValue]);

	useEffect(()=>{
		document.addEventListener('selectionchange', () => {
			const selectedText = document.getSelection()?.toString();
			if (selectedText && isTextareaFocused) {
				setSelection(selectedText);
			} else {
				setSelection('');
			}
		});
	});

	useEffect(()=>{
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && editValue) {
				onCancel();
			}
		});
	});

	const handleClickDelete = () => {
		if (!isConfirmDelete) {
			setConfirmDelete(!isConfirmDelete);
		}
	};

	const onMouseLeaveDelete = () => {
		if (isConfirmDelete) {
			setConfirmDelete(false);
		}
	};

	const handleConfirmFalse = () => {
		setConfirmDelete(false);
	};

	const handleConfirmTrue = () => {
		if (isConfirmDelete && onDelete) {
			onDelete();
		}
	};

	const handleClickHeader = () => {
		setIsEditHeader(onSaveWithHeader !== undefined);
	};

	const onMouseLeaveHeaderArea = () => {
		setIsEditHeader(false);
		if (changedHeader === '') setChangedHeader(header);
	};

	const onMouseEnterTextarea = () => {
		setTextareaFocused(true);
	};

	const onMouseLeaveTextarea = () => {
		setTextareaFocused(false);
	};

	const onMouseEnterWrapper = () => {
		setIsHovering(true);
	};

	const onMouseLeaveWrapper = () => {
		setIsHovering(false);
	};

	const isDisabled = () => {
		return selection === '' || !isTextareaFocused;
	};

	const getCombinationTemplate = (base: string, end: string) => {
		return base + '&' + end + ')|';
	};

	const handleClickOutside = () => {
		if (screenWidth < 600) {
			console.log('should ban');
			return;
		}
		if (!textareaRef) onCancel();
		if (!isHovering) onCancel();
	};

	const wrapSelectedText = (template: string) => {
		if (selection !== '') {
			// Удаляем выделенный текст и вставляем шаблон
			const textarea = textareaRef.current;
			if (!textarea) return;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newText = text.slice(0, start) + template.replace('#text#', selection) + text.slice(end);
			setText(newText);
 
			// Устанавливаем курсор после вставленного шаблона
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(start + template.length, start + template.length);
			}, 0);
		}
	};

	// Парсер, преобразующий текст в структуру `Text`
	

	// Функция добавления шаблона в тексте
	const insertTemplate = (template: string) => {
		const textarea = document.getElementById('editorTextarea') as HTMLTextAreaElement;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const newText = text.slice(0, start) + template + text.slice(end);
		setText(newText);
		// Снова фокусируемся на `textarea`
		setTimeout(() => {
			textarea.setSelectionRange(start + template.length, start + template.length);
			textarea.focus();
		}, 0);
	};
	if (editValue === undefined) return <></>;
	return (
		<div className={styles['background']} onClick={handleClickOutside}>
			<div className={cn(styles['wrapper'], 'big-shadow', color?styles[color]:styles['green'], wrapperCN)} onMouseEnter={onMouseEnterWrapper} onMouseLeave={onMouseLeaveWrapper}>
				<div className={styles['header-wrap']} onMouseLeave={onMouseLeaveHeaderArea}>
					{onSaveWithHeader && <>
						<div className={cn(styles['header'], styles['editableHeader'], isEditHeader ? styles['hidden-tag'] : '')} onClick={handleClickHeader}>
							{changedHeader}
						</div>
						<input type='text' id='changeHeaderInput' className={cn(styles['header-input'], !isEditHeader ? styles['hidden-tag'] : '')} placeholder={header} onChange={(e)=>setChangedHeader(e.target.value)}/>
					</>}
					{!onSaveWithHeader && 
						<div className={cn(styles['header'])}>
							{header}
						</div>
					}
				</div>
				{onDelete && <button className={cn(styles['delete-btn'])} onClick={handleClickDelete} onMouseLeave={onMouseLeaveDelete}>
					{isConfirmDelete ? 'Точно?' : 'Удалить'}
					<img src='/x.svg' alt='delete' className={cn(styles['delete-img'], isConfirmDelete?styles['interactive']:'')} onClick={handleConfirmFalse}/>
					{isConfirmDelete && <img onClick={handleConfirmTrue} src='/more-white.svg' className={cn(isConfirmDelete?styles['interactive']:'', styles['save-img'])} alt='confirm'/> }
				</button>}
				{children}
				<div className={styles['content-wrapper']} onMouseEnter={onMouseEnterTextarea} onMouseLeave={onMouseLeaveTextarea}>
					<div className={styles['lines']}>
						<div className={styles['buttons-line']}>
							<button className={cn(styles['main-btn'], styles['btn'])} onClick={()=>wrapSelectedText(getCombinationTemplate(linkTemplate, normalTemplate))} disabled={isDisabled()}>
								Выделенный текст в ссылку
							</button>
							<button className={cn(styles['btn'], styles['bold'])} onClick={()=>wrapSelectedText(getCombinationTemplate(linkTemplate, boldStyleTemplate))} disabled={isDisabled()}>B</button>
							<button className={cn(styles['btn'], styles['italic'])} onClick={()=>wrapSelectedText(getCombinationTemplate(linkTemplate, italicStyleTemplate))} disabled={isDisabled()}>I</button>
							<button className={cn(styles['btn'], styles['underline'])} onClick={()=>wrapSelectedText(getCombinationTemplate(linkTemplate, underlineStyleTemplate))} disabled={isDisabled()}>U</button>
							<button className={cn(styles['btn'], styles['overline'])} onClick={()=>wrapSelectedText(getCombinationTemplate(linkTemplate, overlineTemplate))} disabled={isDisabled()}>O</button>
						</div>
						<div className={styles['buttons-line']}>
							<div className={styles['btn-text']}>
								Стиль текста
							</div>
							<button className={cn(styles['btn'], styles['bold'])} onClick={()=>wrapSelectedText(getCombinationTemplate(wordTemplate, boldStyleTemplate))} disabled={isDisabled()}>B</button>
							<button className={cn(styles['btn'], styles['italic'])} onClick={()=>wrapSelectedText(getCombinationTemplate(wordTemplate, italicStyleTemplate))} disabled={isDisabled()}>I</button>
							<button className={cn(styles['btn'], styles['underline'])} onClick={()=>wrapSelectedText(getCombinationTemplate(wordTemplate, underlineStyleTemplate))} disabled={isDisabled()}>U</button>
							<button className={cn(styles['btn'], styles['overline'])} onClick={()=>wrapSelectedText(getCombinationTemplate(wordTemplate, overlineTemplate))} disabled={isDisabled()}>O</button>
							<button className={styles['btn']} onClick={()=>wrapSelectedText(getCombinationTemplate(wordTemplate, hiddenStyleTemplate))} disabled={isDisabled()}>H</button>
						</div>
					</div>
					<textarea
						id="editorTextarea"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Введите текст"
						rows={10}
						className={cn(styles['textarea'],textareaCN)}
						ref={textareaRef}>{text}</textarea>
					<div className={styles['lines']}>
						<div className={styles['buttons-line']}>
							<button className={cn(styles['main-btn'], styles['btn'])} onClick={() => insertTemplate('|url(to=ссылка&word=текст ссылки&style=normal)|')}>
								Ссылка
							</button>
							<button className={cn(styles['btn'], styles['bold'])} onClick={() => insertTemplate('|url(to=ссылка&word=текст ссылки&style=bold)|')}>B</button>
							<button className={cn(styles['btn'], styles['italic'])} onClick={() => insertTemplate('|url(to=ссылка&word=текст ссылки&style=italic)|')}>I</button>
							<button className={cn(styles['btn'], styles['underline'])} onClick={() => insertTemplate('|url(to=ссылка&word=текст ссылки&style=underline)|')}>U</button>
							<button className={cn(styles['btn'], styles['overline'])} onClick={() => insertTemplate('|url(to=ссылка&word=текст ссылки&style=overline)|')}>O</button>
						</div>
						<div className={styles['buttons-line']}>
							<div className={styles['btn-text']}>
								Текст со стилем
							</div>
							<button className={cn(styles['btn'], styles['bold'])} onClick={() => insertTemplate('|word(word=текст&style=bold)|')}>B</button>
							<button className={cn(styles['btn'], styles['italic'])} onClick={() => insertTemplate('|word(word=текст&style=italic)|')}>I</button>
							<button className={cn(styles['btn'], styles['underline'])} onClick={() => insertTemplate('|word(word=текст&style=underline)|')}>U</button>
							<button className={cn(styles['btn'], styles['overline'])} onClick={() => insertTemplate('|word(word=текст&style=overline)|')}>O</button>
						</div>
						<button className={cn(styles['main-btn'], styles['btn'])} onClick={() => insertTemplate('|img(src=ссылка&alt=описание)|')}>Изображение</button>
					</div>
				</div>
				<div className={cn(styles['buttons-line'], styles['controls'])}>
					<button className={styles['cancel-btn']} onClick={onCancel}>
						Назад
					</button>
					<button className={cn(styles['save-btn'])}
						onClick={() => {
							const parsedText = parseText(text);
							onSave ? onSave(parsedText) : onSaveWithHeader ? onSaveWithHeader(parsedText, changedHeader) : '';
						}}
					><img src='/more-white.svg' alt='save' className={styles['save-img']}/></button>
				</div>
			</div>
		</div>
	);
}