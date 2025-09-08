import { toast } from 'react-toastify';
import { WarningToast } from './WarningToast';
import { WarningToastProps } from './WarningToast.props';
import { warningToast } from '../../../helpers/toastOptions';

export function defaultToastCall({header, text, onClickButton}: WarningToastProps) {
	return toast(<WarningToast header={header} text={text} onClickButton={onClickButton}/>, warningToast);
}