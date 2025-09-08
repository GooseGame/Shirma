import { toast } from 'react-toastify';
import { DefaultToastProps } from './../DefaultToast/DefaultToast.props';
import { SuccessToast } from './SuccessToast';
import { successToast } from '../../../helpers/toastOptions';

export function successToastCall({header, text}: DefaultToastProps) {
	return toast(<SuccessToast header={header} text={text}/>, successToast);
}