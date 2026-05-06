import { toast } from 'react-toastify';
import { ErrorToast } from '../../components/ToastNotificationItem/ErrorToast/ErrorToast';
import { SuccessToast } from '../../components/ToastNotificationItem/SuccessToast/SuccessToast';
import { pendingToast, successToast, errorToast } from '../toastOptions';
import { randomHash } from '../../helpers/random';
import { reportMissedToast } from '../../helpers/toastMissedTracker';

export const useAsyncToast = () => {
	const showAsyncToast = async <T,>(
		promise: Promise<T>,
		messages: {
      pending: string;
      success?: string;
      error?: string;
    },
		options?: {
      onErrorButton?: React.ReactNode;
    }
	): Promise<T> => {
		const toastId = toast.loading(messages.pending, pendingToast);

		try {
			const result = await promise;
      
			// Проверяем, является ли результат Redux action
			if (result && typeof result === 'object' && 'meta' in result) {
				const action = result as any;
				if (action.meta.requestStatus === 'rejected') {
					throw action.payload || action.error;
				}
			}

			toast.update(toastId, {
				...successToast,
				isLoading: false,
				render: (
					<SuccessToast
						header="Успешно"
						text={messages.success || 'Операция выполнена успешно'}
					/>
				),
				onClose: (reason) => {
					if (reason === true) return;
					const missedId = randomHash();
					reportMissedToast({
						id: missedId,
						variant: 'success',
						header: 'Успешно',
						text: messages.success || 'Операция выполнена успешно'
					});
				}
			});
      
			return result;
		} catch (error) {
			toast.update(toastId, {
				...errorToast,
				isLoading: false,
				render: (
					<ErrorToast
						header="Ошибка"
						text={messages.error || 'Произошла ошибка'}
						onClickButton={options?.onErrorButton}
					/>
				),
				onClose: (reason) => {
					if (reason === true) return;
					const missedId = randomHash();
					reportMissedToast({
						id: missedId,
						variant: 'error',
						header: 'Ошибка',
						text: messages.error || 'Произошла ошибка',
						onClickButton: options?.onErrorButton
					});
				}
			});
			throw error;
		}
	};

	return { showAsyncToast };
};