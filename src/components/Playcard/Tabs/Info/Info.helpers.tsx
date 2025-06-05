import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { Character } from '../../../../interfaces/Character.interface';
import { charActions, CharState } from '../../../../store/slices/Characters.slice';
import { List } from '../../Sticker/Sticker.props';
import styles from './Info.module.css';
import cn from 'classnames';
import { TextInput } from '../../../TextInput/TextInput';

export function getMeasurementsAsTSX(player: Character,onSaveChar: (()=>void)|undefined, dispatch: ThunkDispatch<{characters: CharState}, undefined, UnknownAction> & Dispatch<UnknownAction>): List {
	const saveMeasure = (text: string, property: 'hair' | 'skin' | 'age' | 'height' | 'weight' | 'eyes') => {
		dispatch(charActions.editMeasure({id: player.id, value: text, property}));
		if (onSaveChar) onSaveChar();
	};

	const playerMeasurements: List = {
		type: 'list',
		children: <div className={cn(styles['measurements'])}>
			<div className={styles['measure-wrapper']}>
                Рост: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.height} 
					textCN={cn(styles['measure'], styles['redactable'])}
					buttonCN={styles['confirm-btn']} 
					onSave={(text: string)=>{saveMeasure(text, 'height');}} 
				/>
			</div>
			<div className={styles['measure-wrapper']}>
                Вес: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.weight} 
					textCN={cn(styles['measure'], styles['redactable'])} 
					buttonCN={styles['confirm-btn']}
					onSave={(text: string)=>{saveMeasure(text, 'weight');}} 
				/>
			</div>
			<div className={styles['measure-wrapper']}>
                Возраст: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.age} 
					textCN={cn(styles['measure'], styles['redactable'])} 
					buttonCN={styles['confirm-btn']}
					onSave={(text: string)=>{saveMeasure(text, 'age');}} 
				/>
			</div>
			<div className={styles['measure-wrapper']}>
                Глаза: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.eyes} 
					textCN={cn(styles['measure'], styles['redactable'])} 
					buttonCN={styles['confirm-btn']}
					onSave={(text: string)=>{saveMeasure(text, 'eyes');}} 
				/>
			</div>
			<div className={styles['measure-wrapper']}>
                Кожа: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.skin} 
					textCN={cn(styles['measure'], styles['redactable'])} 
					buttonCN={styles['confirm-btn']}
					onSave={(text: string)=>{saveMeasure(text, 'skin');}} 
				/>
			</div>
			<div className={styles['measure-wrapper']}>
                Волосы: 
				<TextInput 
					wrapperCN={styles['input-wrapper']} 
					inputCN={styles['input']} 
					initialText={player.info.measurements.hair} 
					textCN={cn(styles['measure'], styles['redactable'])}
					buttonCN={styles['confirm-btn']} 
					onSave={(text: string)=>{saveMeasure(text, 'hair');}}/>
			</div>
		</div>
	};
	return playerMeasurements;
}