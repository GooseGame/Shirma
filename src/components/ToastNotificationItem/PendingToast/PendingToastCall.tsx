import { toast } from 'react-toastify';
import { PendingToastProps } from './PendingToast.props';
import { PendingToast } from './PendingToast';
import { pendingToast } from '../../../helpers/toastOptions';

export function pendingToastCall({pendingPromise, headerPending, headerSuccess, headerError, textError, textSuccess, onClickErrButton}: PendingToastProps) {
	return toast(<PendingToast pendingPromise={pendingPromise} headerPending={headerPending} headerSuccess={headerSuccess} headerError={headerError} textError={textError} textSuccess={textSuccess} onClickErrButton={onClickErrButton} />, pendingToast);
}