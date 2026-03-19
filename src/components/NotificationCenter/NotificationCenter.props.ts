import { HTMLAttributes } from 'react';

export interface NotificationCenterProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Toastify containerId для управления toasts (dismiss/события).
	 * По умолчанию совпадает с дефолтным контейнером Toastify.
	 */
	containerId?: number | string;
	/**
	 * Показывать кнопку "Очистить" (dismiss всех toasts внутри контейнера).
	 * По умолчанию true.
	 */
	showClearButton?: boolean;
}