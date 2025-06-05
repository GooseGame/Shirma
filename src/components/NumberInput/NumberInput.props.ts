import React from 'react';

export interface TextInputProps {
	initialValue: number;
	onSave: 	(value: number)=>void;
	textCN?: 	string;
	inputCN?:	string;
	wrapperCN?: string;
	buttonCN?:  string;
	imgBlack?:  boolean;
	valMustBeGreaterZero?: boolean;
	isParentFocus?: boolean;
	setIsParentFocus?: React.Dispatch<React.SetStateAction<boolean>>
}