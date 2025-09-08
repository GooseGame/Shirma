 
import { useEffect, useState } from 'react';
import { PopupProps } from '../../components/Popup/Popup.props';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import { IDLE_TIME, ROLL_ANIMATION_TIME, RollBox, SLIDE_ANIMATION_TIME } from '../../components/RollBox/RollBox';
import { Header } from '../../components/Header/Header';
import { CharacterCard } from '../../layouts/CharacterCard/CharacterCard';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { createCharacter, getCharacterFromLocalStorage } from '../../helpers/createCharacter';
import { charActions } from '../../store/slices/Characters.slice';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import styles from './CharacterPage.module.css';
import { randomHash } from '../../helpers/random';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { ToastNotifications } from '../../components/ToastNotifications/ToastNotifications';
import { toast } from 'react-toastify';
import { defaultToast, errorToast, warningToast } from '../../helpers/toastOptions';
import { DefaultToast } from '../../components/ToastNotificationItem/DefaultToast/DefaultToast';
import { WarningToast } from '../../components/ToastNotificationItem/WarningToast/WarningToast';
import { ErrorToast } from '../../components/ToastNotificationItem/ErrorToast/ErrorToast';

export function CharacterPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isNewCharacter = id === undefined;
	const character = isNewCharacter ? createCharacter() : getCharacterFromLocalStorage(id);
	const [popups, setPopups] = useState<PopupProps[]>([]);
	const [changedCharacterCounter, setChangedCharacterCounter] = useState(0);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(()=>{
		if (!character) {
			navigate('/characters');
		}
		if (character && isNewCharacter) {
			dispatch(charActions.add(character));
		}
	});
	
	const addPopup = (popup: PopupProps) => {
		setPopups([...popups, popup]);
		// toast(<DefaultToast header={popup.header} text={popup.text}/>, defaultToast);
		// toast(
		// 	<WarningToast 
		// 		header={popup.header} 
		// 		text={popup.text} 
		// 		onClickButton={
		// 			<button onClick={()=>console.log('click')}>Понятно</button>
		// 		}
		// 	/>, warningToast
		// );
		// toast(
		// 	<ErrorToast 
		// 		header={popup.header} 
		// 		text={popup.text} 
		// 		onClickButton={
		// 			<button onClick={()=>console.log('click')}>Понятно</button>
		// 		}
		// 	/>, errorToast
		// );
	};
	const removePopup = (id: string) => {
		setPopups(popups.filter(el => el.popupid !== id));
	};
	const clearPopups = () => {
		setPopups([]);
	};

	const onChangeChar = ((popupText?: string, popupHeader?: string)=>{
		setChangedCharacterCounter(changedCharacterCounter+1);
		// if (popupText && popupHeader) {
		// 	addPopup({
		// 		popupid: randomHash(),
		// 		header: popupHeader,
		// 		text: popupText,
		// 		isShow: true
		// 	});
		// }
		if (popupText && popupHeader) {
			console.log('toast');
			
		}
	});

	const [rollBoxProps, setRollboxProps] = useState<Damage[]|DiceCheck[]>([]);
	useEffect(()=>{
		setTimeout(() => {
			if (rollBoxProps.length > 0) {
				setRollboxProps([]);
			}
		}, (SLIDE_ANIMATION_TIME * 2 + IDLE_TIME + ROLL_ANIMATION_TIME - 1));
	},[rollBoxProps]);

	return (
		<RequireAuth>
			<Header/>
			<div className={styles['container']}>
				<ToastNotifications/>
				<NotificationCenter popups={popups} remove={removePopup} clear={clearPopups}/>
				{character && <CharacterCard setPopup={addPopup} character={character} setDiceRoll={setRollboxProps} onChangeChar={onChangeChar}/>}
			</div>
			<MenuMobile/>
			<RollBox dicesSent={rollBoxProps} setPopup={addPopup}/>
			<BanSmallScreens/>
		</RequireAuth>
	);
}