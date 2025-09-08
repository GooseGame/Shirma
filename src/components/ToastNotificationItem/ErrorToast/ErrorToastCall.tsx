import { toast } from 'react-toastify';
import { ErrorToastProps } from './ErrorToast.props';
import { ErrorToast } from './ErrorToast';
import { errorToast } from '../../../helpers/toastOptions';

export function defaultToastCall({header, text, onClickButton}: ErrorToastProps) {
	return toast(<ErrorToast header={header} text={text} onClickButton={onClickButton}/>, errorToast);
}