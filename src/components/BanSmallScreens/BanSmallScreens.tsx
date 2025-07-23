import { FC } from 'react';
import styles from './BanSmallScreens.module.css';

export const BanSmallScreens: FC = () => {
	return <div className={styles['wrapper']}>
		<img src='/dead.svg' className={styles['img']}/>
		<h2 className={styles['text']}>Не, ну ты ещё со смарт часов зайди</h2>
	</div>;
};