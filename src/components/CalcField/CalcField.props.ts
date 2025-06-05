import { HTMLAttributes, ReactNode } from 'react';

export interface CalcFieldProps extends HTMLAttributes<HTMLInputElement> {
	inputValue: string,
	setInputValue: React.Dispatch<React.SetStateAction<string>>,
	validator: (inputValue: string)=>boolean,
	leftCustomElem?: ReactNode,
	rightResultElem?: ReactNode
}