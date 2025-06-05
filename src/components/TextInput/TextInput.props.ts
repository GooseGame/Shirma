export interface TextInputProps {
	initialText: 	string;
	onSave: 		(text: string)=>void;
	onChangeExtra?: ()=>void;
	textCN?: 		string;
	inputCN?:		string;
	wrapperCN?: 	string;
	buttonCN?:  	string;
	inputRef?:		React.RefObject<HTMLInputElement>
}