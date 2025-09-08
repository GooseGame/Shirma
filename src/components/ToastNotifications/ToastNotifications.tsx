import { Slide, ToastContainer } from 'react-toastify';

export function ToastNotifications()
{
	return <ToastContainer 
		position='top-right' 
		hideProgressBar={false} 
		pauseOnFocusLoss 
		draggable 
		newestOnTop={false}
		closeOnClick
		pauseOnHover
		transition={Slide} />;
}