import { CharacterCardProps } from './CharacterCard.props';
import styles from './CharacterCard.module.css';
import { HeadSegment } from '../../components/Playcard/HeadSegment/HeadSegment';
import { useState } from 'react';
import cn from 'classnames';
import { Info } from '../../components/Playcard/Tabs/Info/Info';
import { Characteristics } from '../../components/Playcard/Tabs/Characteristics/Characteristics';
import { Loot } from '../../components/Playcard/Tabs/Loot/Loot';
import { Attacks } from '../../components/Playcard/Tabs/Attacks/Attacks';
import { Notes } from '../../components/Playcard/Tabs/Notes/Notes';
import { Spells } from '../../components/Playcard/Tabs/Spells/Spells';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { charActions } from '../../store/slices/Characters.slice';
import React from 'react';
import { getSegmentName, getSegments } from './CharacterCard.segments';
import { EditAlignment } from './CharacterCard.alignment';
import { randomDiceValue, randomHash } from '../../helpers/random';
import { DiceCheck } from '../../interfaces/Equipment.interface';
import { isValidHttpUrl } from '../../helpers/parser';
import { HeadSegmentProps } from '../../components/Playcard/HeadSegment/HeadSegment.props';

export function CharacterCard({character, setDiceRoll, onChangeChar, setPopup}: CharacterCardProps) {
	const defaultChosenSegmentName = 'info';
	const dispatch = useDispatch<AppDispatch>();
	const locationHook = useLocation();
	const searchParams = new URLSearchParams(locationHook.search);
	let paramValue = searchParams.get('tab');
	if (paramValue === null || !['0','1','2','3','4','5'].includes(paramValue)) {
		paramValue = '0';
	}
	const onSaveCharName = (text: string) => {
		dispatch(charActions.editName({id: character.id, name: text}));
		if (onChangeChar) onChangeChar();
	};
	const navigate = useNavigate();
	const addQueryParam = (key: string, value: string) => {
		const searchParams = new URLSearchParams(locationHook.search);
		searchParams.set(key, value);
		navigate({ search: searchParams.toString() }, { replace: true });
	};
	const [chosenSegment, setChosenSegment] = useState(paramValue);
	const [chosenSegmentName, setChosenSegmentName] = useState(getSegmentName(paramValue));

	const [alignmentClicked, setAlignmentClicked] = useState(false);

	const [savedClassName, setSavedClassName] = useState(character.info.class.name);
	const [savedSubClassName, setSavedSubClassName] = useState(character.info.class.subclass);
	const [savedRace, setSavedRace] = useState(character.info.race);
	const [isShowEditRaceClass, setShowEditRaceClass] = useState(false);

	const [isShowAvaPopup, setShowAvaPopup] = useState(false);
	const [avaUrl, setAvaUrl] = useState(character.avatar);
	const onSaveAvatar = (url: string) => {
		if (url !== '') {
			if (isValidHttpUrl(url)) {
				dispatch(charActions.editAvatar({id: character.id, name:url}));
			}
		}
		setShowAvaPopup(false);
	};

	const onSaveRaceClassSubclass = (race: string, className: string, subclass?: string) => {
		const changes = [];
		if (character.info.race !== race) changes.push(`Раса: ${character.info.race} - ${race}`);
		if (character.info.class.name !== className) changes.push(`Класс: ${character.info.class.name} - ${className}`);
		if (character.info.class.subclass !== subclass) changes.push(`Подкласс: ${character.info.class.subclass ? character.info.class.subclass : 'добавлен новый'} - ${subclass ? subclass : 'удалён'}`);
		if (setPopup) setPopup({
			popupid: randomHash(),
			header: 'Изменены характеристики',
			text: changes.join('/n'),
			isShow: true
		});
		dispatch(charActions.editClassSubclassRace({id: character.id, value: {race, className, subclass}}));
		if (onChangeChar) onChangeChar();
	};
	const handleSaveRaceClassForm = () => {
		if (savedRace !== '' && savedClassName !== '') {
			onSaveRaceClassSubclass(savedRace, savedClassName, savedSubClassName);
			setShowEditRaceClass(false);
		}
	};

	const onCancelEditRaceClass = () => {
		setSavedClassName(character.info.class.name);
		setSavedSubClassName(character.info.class.subclass);
		setSavedRace(character.info.race);
		setShowEditRaceClass(false);
	};

	const handleClickRaceClassText = () => {
		setShowEditRaceClass(true);
	};

	const handleClickAlignment = () => {
		setAlignmentClicked(true);
	};

	const [isFocusingArmor, setIsFocusingArmor] = useState(false);
	const [isFocusingSpeed, setIsFocusingSpeed] = useState(false);

	const onSaveArmor = (value: number) => {
		if (value >= 0) {
			if (setPopup) setPopup({
				popupid: randomHash(),
				header: 'Изменены характеристики',
				text: `Защита: ${character.condition.armor} - ${value}`,
				isShow: true
			});
			dispatch(charActions.editArmor({id: character.id, value}));
		}
	};
	const onSaveSpeed = (value: number) => {
		if (value >= 0) {
			if (setPopup) setPopup({
				popupid: randomHash(),
				header: 'Изменены характеристики',
				text: `Скорость: ${character.condition.speed} - ${value}`,
				isShow: true
			});
			dispatch(charActions.editSpeed({id: character.id, value}));
		}
	};

	const onClickArmor = () => {
		setIsFocusingArmor(true);
	};
	const onMouseLeaveArmor = () => {
		setIsFocusingArmor(false);
	};

	const onClickSpeed = () => {
		setIsFocusingSpeed(true);
	};
	const onMouseLeaveSpeed = () => {
		setIsFocusingSpeed(false);
	};
	
	const handleClickSegment = (e: React.MouseEvent) => {
		const segmentId = e.currentTarget.id;
		const segmentName = segmentsData.find(el => (el.segmentId === segmentId))?.segmentName;
		setChosenSegment(segmentId);
		setChosenSegmentName(segmentName ?? defaultChosenSegmentName);
		addQueryParam('tab', e.currentTarget.id);
	};

	const onClickInspiration = () => {
		if (setPopup) setPopup({
			popupid: randomHash(),
			header: 'Вдохновление',
			text: !character.condition.inspiration ? 'Вдохновлён!' : 'Потерял вдохновение(',
			isShow: true
		});
		dispatch(charActions.addRemoveInspiration({id: character.id}));
		if (onChangeChar) onChangeChar();
	};

	const [isShowProfInput, setIsShowProfInput] = useState(false);
	const handleSaveProf = (value: number) => {
		if (value >= 0 && value < 99) {
			if (setPopup) setPopup({
				popupid: randomHash(),
				header: 'Изменены характеристики',
				text: `Владение: ${character.proficiency} - ${value}`,
				isShow: true
			});
			dispatch(charActions.changeProf({id: character.id, value}));
			if (onChangeChar) onChangeChar();
			setIsShowProfInput(false);
		}
	};
	const profHandler = {
		isShowProfInput,
		setIsShowProfInput,
		handleSaveProf
	};

	const avaHandler = {
		isShowAvaPopup,
		setShowAvaPopup,
		onSaveAvatar,
		avaUrl,
		setAvaUrl
	};

	const savedRaceClassObj = {
		savedRace,
		setSavedRace,
		savedClassName,
		setSavedClassName,
		savedSubClassName,
		setSavedSubClassName,
		handleClickRaceClassText,
		isShowEditRaceClass,
		onCancelEditRaceClass,
		handleSaveRaceClassForm
	};
	const armorHandlers = {
		onClickArmor,
		onMouseLeaveArmor,
		isFocusingArmor,
		onSaveArmor
	};
	const speedHandler = {
		onClickSpeed,
		onMouseLeaveSpeed,
		isFocusingSpeed,
		onSaveSpeed
	};

	const [savedIni, setSavedIni] = useState(character.condition.initiative);
	const [isShowIniPopup, setIsShowIniPopup] = useState(false);
	const onCancelIniPopup = () => {
		setIsShowIniPopup(false);
		setSavedIni(character.condition.initiative);
	};
	const handleSaveIniPopup = () => {
		if (savedIni > -99 && savedIni < 99) {
			dispatch(charActions.changeIniciative({id: character.id, value: savedIni}));
			if (onChangeChar) onChangeChar();
			setIsShowIniPopup(false);
		}
	};
	const iniciativeHandler = {
		savedIni,
		setSavedIni,
		onCancelIniPopup,
		handleSaveIniPopup,
		isShowIniPopup,
		setIsShowIniPopup
	};

	const [isShowCoinsPopup, setShowCoinsPopup] = useState(false);
	const handleSaveCoins = (value: number, coinType: string) => {
		if (coinType !== 'gold' && coinType !== 'silver' && coinType !== 'copper') return;
		if (value===0) return;
		if (value < 0) {
			dispatch(charActions.removeCoins({id: character.id, coinType, value: -1*value}));
		} else {
			dispatch(charActions.addCoins({id: character.id, coinType, value}));
		}
		if (onChangeChar) onChangeChar();
	};
	const onCancelCoinsPopup = () => {
		setShowCoinsPopup(false);
	};
	const coinsHandler = {
		isShowCoinsPopup,
		setShowCoinsPopup,
		handleSaveCoins,
		onCancelCoinsPopup
	};

	const [isShowExpPopup, setShowExpPopup] = useState(false);
	const handleSaveExp = (value: number) => {
		if (value===0) return;
		if (value < 0) {
			dispatch(charActions.removeExp({id: character.id, value}));
		} else {
			dispatch(charActions.addExp({id: character.id, value}));
		}
	};
	const handleSaveLvl = (isLVLUp: boolean) => {
		if (isLVLUp) {
			dispatch(charActions.lvlUp({id: character.id}));
		} else {
			dispatch(charActions.lvlDown({id: character.id}));
		}
	};
	const setLvl = (level: number) => {
		if (level > 0 && level <= 20) {
			dispatch(charActions.setLVL({id: character.id, value: level}));
		}
	};
	const onCancelExpPopup = () => {
		setShowExpPopup(false);
	};
	const expHandler = {
		isShowExpPopup,
		setShowExpPopup,
		handleSaveExp,
		handleSaveLvl,
		onCancelExpPopup,
		setLvl
	};

	const [isShowHealthPopup, setShowHealthPopup] = useState(false);
	const changeHealth = (value: number, type: 'extra'|'default') => {
		if (value===0) return;
		if (type === 'default') {
			if (value > 0) {
				dispatch(charActions.addHealth({id: character.id, value}));
			} else {
				dispatch(charActions.removeHealth({id: character.id, value: -1*value}));
			}
		} else {
			if (value > 0) {
				dispatch(charActions.addExtraHealth({id: character.id, value}));
			}
		}
	};
	const onClickStabilize = (stabilisationValue?: number, mode?: 'success'|'fail') => {
		if ((stabilisationValue || stabilisationValue === 0) && mode) {
			dispatch(charActions.stabilize({id: character.id, mode, value: stabilisationValue}));
		} else {
			const d20 = {typeId: 0, modifiers: 0, value: {edge: 20, count: 1}} as DiceCheck;
			const diceResult = randomDiceValue(d20.value);
			if (setDiceRoll) setDiceRoll([{...d20, value: {...d20.value, value: diceResult}}]);
			const resultOfThrow = diceResult >= 10 ? 'success' : 'fail';
			const result = (diceResult === 1 || diceResult === 20) ? 2 : 1;
			dispatch(charActions.stabilize({id: character.id, mode: resultOfThrow, value: result + character.condition.health.stabilization[resultOfThrow]}));
		}
	};
	const changeMaxHP = (newValue: number) => {
		if (newValue > 0 && newValue < 999) {
			dispatch(charActions.changeMaxHP({id: character.id, value: newValue}));
		}
	};
	const changeHPDice = (value: number) => {
		if (![2,4,6,8,10,12,20].includes(value)) return;
		dispatch(charActions.editHPDice({id: character.id, value: {count: 1, edge: value}}));
	};

	const getGroupableSegments = (segments: HeadSegmentProps[]) => {
		const group = segments.filter(segment => segment.groupable);
		const active = group.find(s => s.segmentId === chosenSegment);
		if (!active) return group;
		return [...group.filter(g => g.segmentId !== chosenSegment), active];
	};
	
	const healthHandler = {
		isShowHealthPopup,
		setShowHealthPopup,
		changeHealth,
		onClickStabilize,
		changeMaxHP,
		changeHPDice
	};


	const segmentsData = getSegments(
		{
			character, 
			savedRaceClassObj, 
			onSaveCharName, 
			handleClickAlignment, 
			armorHandlers, 
			speedHandler, 
			onClickInspiration, 
			iniciativeHandler, 
			setDiceRoll, 
			profHandler, 
			coinsHandler, 
			expHandler,
			healthHandler,
			avaHandler
		});

	return <div className={styles['card']}>
		<div className={styles['char-card']}>
			<div className={cn(styles['header-area'], styles[chosenSegmentName+'-header'])}>
				{segmentsData.map(segment =>{
					if (segment.groupable) return;
					return <HeadSegment 
						onClick={handleClickSegment}
						key={segment.segmentId} 
						active={segment.segmentId === chosenSegment}
						{...segment}/>;
				})}
				<div className={styles['group']}>
					{getGroupableSegments(segmentsData).map(groupable => (
						<HeadSegment 
							onClick={handleClickSegment}
							key={groupable.segmentId} 
							active={groupable.segmentId === chosenSegment}
							classNames={styles['groupable']}
							{...groupable}/>
					))}
				</div>
			</div>
			<div className={cn(styles['content'], styles[chosenSegmentName], styles['scrollable'])}>
				{chosenSegment === '0' && 
				<>
					<Info player={character} onChangeChar={onChangeChar}/>
					{alignmentClicked && 
						<EditAlignment character={character} onChangeChar={onChangeChar} setAlignmentClicked={setAlignmentClicked}/>
					}
				</>
				}
				{chosenSegment === '1' && <Characteristics player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
				{chosenSegment === '2' && <Loot player={character} onChangeChar={onChangeChar}/>}
				{chosenSegment === '3' && <Attacks player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
				{chosenSegment === '4' && <Notes player={character} onChangeChar={onChangeChar}/>}
				{chosenSegment === '5' && <Spells player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
			</div>
		</div>
	</div>;
}