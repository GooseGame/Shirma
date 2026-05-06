import { toast } from 'react-toastify';
import { WarningToast } from './WarningToast';
import { WarningToastProps } from './WarningToast.props';
import { warningToast } from '../../../helpers/toastOptions';
import { randomHash } from '../../../helpers/random';
import { reportMissedToast } from '../../../helpers/toastMissedTracker';

export function defaultToastCall({header, text, onClickButton}: WarningToastProps) {
	const missedId = randomHash();
	return toast(<WarningToast header={header} text={text} onClickButton={onClickButton}/>, {
		...warningToast,
		onClose: (reason) => {
			if (reason === true) return;
			reportMissedToast({ id: missedId, variant: 'warning', header, text, onClickButton });
		}
	});
}