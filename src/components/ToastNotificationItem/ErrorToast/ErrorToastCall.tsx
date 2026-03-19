import { toast } from 'react-toastify';
import { ErrorToastProps } from './ErrorToast.props';
import { ErrorToast } from './ErrorToast';
import { errorToast } from '../../../helpers/toastOptions';
import { randomHash } from '../../../helpers/random';
import { reportMissedToast } from '../../../helpers/toastMissedTracker';

export function defaultToastCall({header, text, onClickButton}: ErrorToastProps) {
	const missedId = randomHash();
	return toast(<ErrorToast header={header} text={text} onClickButton={onClickButton}/>, {
		...errorToast,
		onClose: (reason) => {
			if (reason === true) return;
			reportMissedToast({ id: missedId, variant: 'error', header, text, onClickButton });
		}
	});
}