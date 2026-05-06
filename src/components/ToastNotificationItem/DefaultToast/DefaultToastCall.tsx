import { toast } from 'react-toastify';
import { DefaultToastProps } from './DefaultToast.props';
import { DefaultToast } from './DefaultToast';
import { defaultToast } from '../../../helpers/toastOptions';
import { randomHash } from '../../../helpers/random';
import { reportMissedToast } from '../../../helpers/toastMissedTracker';

export function defaultToastCall({header, text}: DefaultToastProps) {
	const missedId = randomHash();
	return toast(<DefaultToast header={header} text={text}/>, {
		...defaultToast,
		onClose: (reason) => {
			if (reason === true) return;
			reportMissedToast({ id: missedId, variant: 'default', header, text });
		}
	});
}