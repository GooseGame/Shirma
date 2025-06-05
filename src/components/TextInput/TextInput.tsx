import { TextInputProps } from './TextInput.props';
import styles from './TextInput.module.css';
import cn from 'classnames';
import { useState } from 'react';

export function TextInput({initialText, onSave, textCN, inputCN, wrapperCN, buttonCN, inputRef, onChangeExtra}: TextInputProps) {
	const [text, setText] = useState<string>(initialText);
	const [isFocusing, setIsFocusing] = useState(false);

	const onCancel = () => {
		setIsFocusing(false);
		setText(initialText);
	};

	return <div className={cn(styles['wrapper'], wrapperCN)} onMouseLeave={()=>{(isFocusing||initialText==='')?onCancel():'';}}>
		{!isFocusing && 
			<div 
				className={cn(styles['text'], textCN)} 
				onClick={()=>setIsFocusing(true)}>{text}
			</div>
		}
		{isFocusing && 
			<input 
				type='text' 
				placeholder={text} 
				value={text} 
				className={cn(styles['input'], inputCN)} 
				ref={inputRef} 
				onChange={(e)=>{setText(e.target.value); onChangeExtra ? onChangeExtra() : '';}}
			/>
		}
		{(isFocusing && text!=='') && 
			<button 
				className={cn(styles['confirm'], buttonCN)} 
				onClick={()=>{onSave(text); setIsFocusing(false);}}
			>
				<img src='/more-white.svg' alt='confirm' className={styles['img']}/>
			</button>
		}
	</div>;
}