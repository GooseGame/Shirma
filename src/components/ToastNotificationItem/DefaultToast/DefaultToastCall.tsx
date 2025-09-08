import { toast } from 'react-toastify';
import { DefaultToastProps } from './DefaultToast.props';
import { DefaultToast } from './DefaultToast';
import { defaultToast } from '../../../helpers/toastOptions';

export function defaultToastCall({header, text}: DefaultToastProps) {

	return toast(<DefaultToast header={header} text={text}/>, defaultToast);
}