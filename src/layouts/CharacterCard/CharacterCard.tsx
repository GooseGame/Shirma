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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { charActions, save } from '../../store/slices/Characters.slice';
import React from 'react';
import { getDesktopSideData, getSegmentName, getSegments } from './CharacterCard.segments';
import { EditAlignment } from './CharacterCard.alignment';
import { randomDiceValue, randomHash } from '../../helpers/random';
import { DiceCheck } from '../../interfaces/Equipment.interface';
import { isValidHttpUrl } from '../../helpers/parser';
import { HeadSegmentProps } from '../../components/Playcard/HeadSegment/HeadSegment.props';
import { SquareButton } from '../../components/Button/Button';
import { pendingToastCall } from '../../components/ToastNotificationItem/PendingToast/PendingToastCall';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';
import { CharacterCardDesktopSide } from './CharacterCard.desktopSide';

export function CharacterCard({
	character,
	setDiceRoll,
	onChangeChar,
	setPopup,
	onSaveCharacter,
	onDeleteCharacter,
	saveButtonLabel,
	actionsBottomContent
}: CharacterCardProps) {
	const defaultChosenSegmentName = 'info';
	const dispatch = useDispatch<AppDispatch>();
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const characterFromStore = useSelector((s: RootState) =>
		s.characters.characters.find(ch => ch.id === character.id)
	);
	const locationHook = useLocation();
	const searchParams = new URLSearchParams(locationHook.search);
	let paramValue = searchParams.get('tab');
	if (paramValue === null || !['0','1','2','3','4','5'].includes(paramValue)) {
		paramValue = '0';
	}
	const onSaveCharName = (text: string) => {
		dispatch(charActions.editName({id: character.id, name: text}));
		if (onChangeChar) onChangeChar(text,'Изменено имя персонажа:');
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

	const setPopupByStrings = (text: string, header: string) => {
		if (setPopup) setPopup({
			popupid: randomHash(),
			header,
			text,
			isShow: true
		});
	};
	const onSaveRaceClassSubclass = (race: string, className: string, subclass?: string) => {
		const changes = [];
		if (character.info.race !== race) changes.push(`Раса: ${character.info.race} - ${race}`);
		if (character.info.class.name !== className) changes.push(`Класс: ${character.info.class.name} - ${className}`);
		if (character.info.class.subclass !== subclass) changes.push(`Подкласс: ${character.info.class.subclass ? character.info.class.subclass : 'добавлен новый'} - ${subclass ? subclass : 'удалён'}`);
		dispatch(charActions.editClassSubclassRace({id: character.id, value: {race, className, subclass}}));
		if (onChangeChar) onChangeChar(changes.join('/n'), 'Изменены характеристики');
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

	const [savedArmor, setSavedArmor] = useState(character.condition.armor);
	const [isShowArmorPopup, setIsShowArmorPopup] = useState(false);
	const onCancelArmorPopup = () => {
		setIsShowArmorPopup(false);
		setSavedArmor(character.condition.armor);
	};
	const handleSaveArmorPopup = () => {
		if (savedArmor >= 0) {
			dispatch(charActions.editArmor({id: character.id, value: savedArmor}));
			if (onChangeChar) onChangeChar(`Защита: ${character.condition.armor} - ${savedArmor}`,'Изменены характеристики');
			setIsShowArmorPopup(false);
		}
	};
	const [savedSpeed, setSavedSpeed] = useState(character.condition.speed);
	const [isShowSpeedPopup, setIsShowSpeedPopup] = useState(false);
	const onCancelSpeedPopup = () => {
		setIsShowSpeedPopup(false);
		setSavedSpeed(character.condition.speed);
	};
	const handleSaveSpeedPopup = () => {
		if (savedSpeed >= 0) {
			dispatch(charActions.editSpeed({id: character.id, value: savedSpeed}));
			if (onChangeChar) onChangeChar(`Скорость: ${character.condition.speed} - ${savedSpeed}`,'Изменены характеристики');
			setIsShowSpeedPopup(false);
		}
	};
	
	const handleClickSegment = (e: React.MouseEvent) => {
		const segmentId = e.currentTarget.id;
		const segmentName = segmentsData.find(el => (el.segmentId === segmentId))?.segmentName;
		setChosenSegment(segmentId);
		setChosenSegmentName(segmentName ?? defaultChosenSegmentName);
		addQueryParam('tab', e.currentTarget.id);
	};

	const onClickInspiration = () => {
		dispatch(charActions.addRemoveInspiration({id: character.id}));
		if (onChangeChar) onChangeChar(!character.condition.inspiration ? 'Вдохновлён!' : 'Потерял вдохновение(', 'Вдохновление');
	};

	const [savedProf, setSavedProf] = useState(character.proficiency);
	const [isShowProfPopup, setIsShowProfPopup] = useState(false);
	const onCancelProfPopup = () => {
		setIsShowProfPopup(false);
		setSavedProf(character.proficiency);
	};
	const handleSaveProf = () => {
		if (savedProf >= 0 && savedProf < 99) {
				dispatch(charActions.changeProf({id: character.id, value: savedProf}));
			if (onChangeChar) onChangeChar(`Владение: ${character.proficiency} - ${savedProf}`,'Изменены характеристики');
			setIsShowProfPopup(false);
		}
	};
	const profHandler = {
		savedProf,
		setSavedProf,
		isShowProfPopup,
		setIsShowProfPopup,
		onCancelProfPopup,
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
		savedArmor,
		setSavedArmor,
		isShowArmorPopup,
		setIsShowArmorPopup,
		onCancelArmorPopup,
		handleSaveArmorPopup
	};
	const speedHandler = {
		savedSpeed,
		setSavedSpeed,
		isShowSpeedPopup,
		setIsShowSpeedPopup,
		onCancelSpeedPopup,
		handleSaveSpeedPopup
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
			if (onChangeChar) onChangeChar('новое значение - '+savedIni,'Изменена инциатива:');
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
		if (onChangeChar) onChangeChar(value > 0 ? value+' '+coinType : -1*value+' '+coinType,value > 0 ? 'Заработал денег:' : 'Потратил деньги:');
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
		if (onChangeChar) onChangeChar(`Опыт: ${character.info.exp} - ${value}`,'Опыт');
	};
	const handleSaveLvl = (isLVLUp: boolean) => {
		if (isLVLUp) {
			dispatch(charActions.lvlUp({id: character.id}));
		} else {
			dispatch(charActions.lvlDown({id: character.id}));
		}
		if (onChangeChar) onChangeChar();
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
		if (onChangeChar) onChangeChar();
	};
	const onClickStabilize = (stabilisationValue?: number, mode?: 'success'|'fail') => {
		if ((stabilisationValue || stabilisationValue === 0) && mode) {
			dispatch(charActions.stabilize({id: character.id, mode, value: stabilisationValue}));
			if (onChangeChar) onChangeChar();
		} else {
			const d20 = {typeId: 0, modifiers: 0, value: {edge: 20, count: 1}} as DiceCheck;
			const diceResult = randomDiceValue(d20.value);
			if (setDiceRoll) setDiceRoll([{...d20, value: {...d20.value, value: diceResult}}]);
			const resultOfThrow = diceResult >= 10 ? 'success' : 'fail';
			const result = (diceResult === 1 || diceResult === 20) ? 2 : 1;
			dispatch(charActions.stabilize({id: character.id, mode: resultOfThrow, value: result + character.condition.health.stabilization[resultOfThrow]}));
			if (onChangeChar) onChangeChar();
		}
	};
	const changeMaxHP = (newValue: number) => {
		if (newValue > 0 && newValue < 999) {
			dispatch(charActions.changeMaxHP({id: character.id, value: newValue}));
			if (onChangeChar) onChangeChar(`Максимальное здоровье: ${character.condition.health.max} - ${newValue}`,'Изменены характеристики');
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

	const segmentProps = {
		character,
		setPopupByStrings,
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
	};

	const segmentsData = getSegments(segmentProps);
	const desktopData = getDesktopSideData(segmentProps);

	const onClickSave = async () => {
		const charToSave = characterFromStore ?? character;
		if (onSaveCharacter) {
			await onSaveCharacter(charToSave);
			return;
		}
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы сохранять персонажей.' });
			return;
		}
		const timestamp = Date.now();
		const pendingPromise = dispatch(save({ character: charToSave, accessToken, timestamp })).unwrap();
		pendingToastCall({
			pendingPromise,
			headerPending: 'Сохранение...',
			headerSuccess: 'Сохранено',
			headerError: 'Ошибка',
			textSuccess: 'Персонаж сохранён.',
			textError: 'Не удалось сохранить персонажа.'
		});
		await pendingPromise;
	};

	const onClickDelete = async () => {
		const charToDelete = characterFromStore ?? character;
		if (!onDeleteCharacter) {
			return;
		}
		await onDeleteCharacter(charToDelete);
	};

	return <div className={styles['card']}>
		<div className={styles['char-card']}>
			<div className={cn(styles['header-area'], styles['header-area-default'], styles[chosenSegmentName+'-header'])}>
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
				<div className={styles['actions']}>
					<div className={styles['actions-main']}>
						{onDeleteCharacter && (
							<SquareButton
								isBigShadow={true}
								classNames={styles['deleteBtn']}
								onClick={onClickDelete}
							>
								Удалить
							</SquareButton>
						)}
						<SquareButton
							isBigShadow={true}
							classNames={styles['saveBtn']}
							disabled={!accessToken && !onSaveCharacter}
							onClick={onClickSave}
						>
							{saveButtonLabel ?? 'Сохранить'}
						</SquareButton>
					</div>
					{actionsBottomContent && (
						<div className={styles['actions-bottom']}>
							{actionsBottomContent}
						</div>
					)}
				</div>
			</div>
			<div className={styles['desktop-main']}>
				<div className={cn(styles['header-area'], styles['header-area-desktop'])}>
					{segmentsData.map(segment => (
						<div
							key={segment.segmentId}
							id={segment.segmentId}
							className={cn(
								styles['desktop-tab'],
								styles[segment.segmentName],
								segment.segmentId === chosenSegment ? styles['desktop-tab-active'] : ''
							)}
							onClick={handleClickSegment}
						>
							{segment.header}
						</div>
					))}
				</div>
			<div className={cn(styles['content'], styles[chosenSegmentName], styles['scrollable'])}>
				{chosenSegment === '0' && 
				<>
					<Info player={character} onChangeChar={onChangeChar}/>
  				</>
				}
				{chosenSegment === '1' && <Characteristics player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
				{chosenSegment === '2' && <Loot player={character} onChangeChar={onChangeChar}/>}
				{chosenSegment === '3' && <Attacks player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
				{chosenSegment === '4' && <Notes player={character} onChangeChar={onChangeChar}/>}
				{chosenSegment === '5' && <Spells player={character} setDiceRoll={setDiceRoll} onChangeChar={onChangeChar}/>}
				{alignmentClicked && 
					<EditAlignment character={character} onChangeChar={onChangeChar} setAlignmentClicked={setAlignmentClicked}/>
				}
			</div>
			</div>
			<CharacterCardDesktopSide
				desktopData={desktopData}
				accessToken={accessToken}
				onClickSave={onClickSave}
				onClickDelete={onDeleteCharacter ? onClickDelete : undefined}
				saveButtonLabel={saveButtonLabel}
				actionsBottomContent={actionsBottomContent}
			/>
		</div>
	</div>;
}