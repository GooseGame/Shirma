import { toast } from 'react-toastify';
import { DefaultToastProps } from './../DefaultToast/DefaultToast.props';
import { SuccessToast } from './SuccessToast';
import { successToast } from '../../../helpers/toastOptions';
import { randomHash } from '../../../helpers/random';
import { reportMissedToast } from '../../../helpers/toastMissedTracker';

export function successToastCall({header, text}: DefaultToastProps) {
	const missedId = randomHash();
	return toast(<SuccessToast header={header} text={text}/>, {
		...successToast,
		onClose: (reason) => {
			if (reason === true) return;
			reportMissedToast({ id: missedId, variant: 'success', header, text });
		}
	});
}