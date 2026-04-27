import { Slide, ToastIcon, ToastOptions } from 'react-toastify';

export const defaultToast: ToastOptions = {
	type: 'default',
	autoClose: 3000,
	draggable: true,
	transition: Slide,
	pauseOnHover: true,
	pauseOnFocusLoss: true
};

export const warningIcon: ToastIcon = <img src='/warning.svg'/>;
export const errorIcon: ToastIcon = <img src='/error.svg'/>;
export const successIcon: ToastIcon = <img src='/success.svg'/>;
export const pendingIcon: ToastIcon = <img src='/loader.gif'/>;

export const warningToast: ToastOptions = {
	type: 'warning',
	autoClose: 5000,
	draggable: true,
	transition: Slide,
	icon: warningIcon,
	closeOnClick: true,
	closeButton: true
};

export const errorToast: ToastOptions = {
	type: 'error',
	autoClose: 5000,
	draggable: true,
	transition: Slide,
	icon: errorIcon,
	closeOnClick: true,
	closeButton: true
};

export const successToast: ToastOptions = {
	type: 'success',
	draggable: true,
	transition: Slide,
	icon: successIcon,
	autoClose: 3000,
	pauseOnHover: true,
	pauseOnFocusLoss: true,
	closeOnClick: true
};

export const pendingToast: ToastOptions = {
	type: 'default',
	draggable: false,
	transition: Slide,
	autoClose: false,
	closeButton: false,
	closeOnClick: false,
	icon: pendingIcon
};