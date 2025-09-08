import { Slide, ToastIcon, ToastOptions } from 'react-toastify';

export const defaultToast: ToastOptions = {
	type: 'default',
	position: 'top-right',
	autoClose: 5000,
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
	position: 'top-right',
	autoClose: false,
	draggable: true,
	transition: Slide,
	icon: warningIcon,
	closeOnClick: false
};

export const errorToast: ToastOptions = {
	type: 'error',
	position: 'top-right',
	autoClose: false,
	draggable: true,
	transition: Slide,
	icon: errorIcon,
	closeOnClick: false
};

export const successToast: ToastOptions = {
	type: 'error',
	position: 'top-right',
	draggable: true,
	transition: Slide,
	icon: successIcon,
	autoClose: 5000,
	pauseOnHover: true,
	pauseOnFocusLoss: true,
	closeOnClick: true
};

export const pendingToast: ToastOptions = {
	type: 'default',
	position: 'top-right',
	draggable: false,
	transition: Slide,
	autoClose: false,
	closeButton: false,
	closeOnClick: false,
	icon: pendingIcon
};