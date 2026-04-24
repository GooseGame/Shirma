import React from 'react';
import { HeadSegmentProps } from '../../components/Playcard/HeadSegment/HeadSegment.props';
import { thatLevelLowBorder } from '../../helpers/experience';
import { numberToShortStringObj } from '../../helpers/format';
import { Character } from '../../interfaces/Character.interface';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import {
	getArsenalSegment,
	getAttacksSegment,
	getCharacteristicsDesktopData,
	getCharacteristicsSegment,
	getGroupSegment,
	getInfoDesktopData,
	getInfoSegment
} from './CharacterCard.segmentFactories';

export const getSegmentName = (key: string) => {
	switch (key) {
	case '1':
		return 'characteristics';
	case '2':
		return 'arsenal';
	case '3':
		return 'attacks';
	case '4':
		return 'notes';
	case '5':
		return 'spells';
	default:
		return 'info';
	}
};

export interface GetSegmentsProps {
	character: Character,
	setPopupByStrings: (text: string, header: string)=>void,
	savedRaceClassObj: SavedRaceClassObj,
	onSaveCharName: (text: string)=>void,
	handleClickAlignment: ()=>void,
	armorHandlers: ArmorHandlers,
	speedHandler: SpeedHandlers,
	onClickInspiration: ()=>void,
	iniciativeHandler: IniciativeHandler,
	setDiceRoll: React.Dispatch<React.SetStateAction<Damage[] | DiceCheck[]>> | undefined,
	profHandler: ProfHandler,
	coinsHandler: CoinsHandler,
	expHandler: ExpHandler,
	healthHandler: HealthHandler,
	avaHandler: AvaHandler
}

export interface SavedRaceClassObj {
	savedRace: string,
	setSavedRace: React.Dispatch<React.SetStateAction<string>>,
	savedClassName: string,
	setSavedClassName: React.Dispatch<React.SetStateAction<string>>,
	savedSubClassName: string | undefined,
	setSavedSubClassName: React.Dispatch<React.SetStateAction<string | undefined>>,
	handleClickRaceClassText: ()=>void,
	isShowEditRaceClass: boolean,
	onCancelEditRaceClass: ()=>void,
	handleSaveRaceClassForm: () => void
}

export interface ArmorHandlers {
	savedArmor: number,
	setSavedArmor: React.Dispatch<React.SetStateAction<number>>,
	isShowArmorPopup: boolean,
	setIsShowArmorPopup: React.Dispatch<React.SetStateAction<boolean>>,
	onCancelArmorPopup: ()=>void,
	handleSaveArmorPopup: ()=>void
}

export interface SpeedHandlers {
	savedSpeed: number,
	setSavedSpeed: React.Dispatch<React.SetStateAction<number>>,
	isShowSpeedPopup: boolean,
	setIsShowSpeedPopup: React.Dispatch<React.SetStateAction<boolean>>,
	onCancelSpeedPopup: ()=>void,
	handleSaveSpeedPopup: ()=>void
}

export interface IniciativeHandler {
	savedIni: number,
	setSavedIni: React.Dispatch<React.SetStateAction<number>>,
	isShowIniPopup: boolean,
	setIsShowIniPopup: React.Dispatch<React.SetStateAction<boolean>>,
	onCancelIniPopup: ()=>void,
	handleSaveIniPopup: ()=>void
}

export interface ProfHandler {
	savedProf: number,
	setSavedProf: React.Dispatch<React.SetStateAction<number>>,
	isShowProfPopup: boolean,
	setIsShowProfPopup: React.Dispatch<React.SetStateAction<boolean>>,
	onCancelProfPopup: ()=>void,
	handleSaveProf: ()=>void
}

export interface CoinsHandler {
	isShowCoinsPopup: boolean,
	setShowCoinsPopup: React.Dispatch<React.SetStateAction<boolean>>,
	handleSaveCoins: (value: number, coinType: string) => void,
	onCancelCoinsPopup: ()=>void
}

export interface ExpHandler {
	isShowExpPopup: boolean,
	setShowExpPopup: React.Dispatch<React.SetStateAction<boolean>>,
	handleSaveExp: (value: number) => void,
	handleSaveLvl: (isLVLUp: boolean) => void,
	onCancelExpPopup: ()=>void,
	setLvl: (level: number) =>void
}

export interface HealthHandler {
	isShowHealthPopup: boolean,
	setShowHealthPopup: React.Dispatch<React.SetStateAction<boolean>>,
	changeHealth: (value: number, type: 'extra' | 'default') => void,
	onClickStabilize: (stabilisationValue?: number, mode?: 'success' | 'fail') => void,
	changeMaxHP: (newValue: number) => void,
	changeHPDice: (value: number) => void
}

export interface AvaHandler {
	isShowAvaPopup: boolean;
	setShowAvaPopup: React.Dispatch<React.SetStateAction<boolean>>;
	onSaveAvatar: (url: string) => void;
	avaUrl: string;
	setAvaUrl: React.Dispatch<React.SetStateAction<string>>;
}

const getExpBarWidth = (exp: number, xpToNextLVL: number | undefined) => {
	if (!xpToNextLVL || exp >= xpToNextLVL) return 100;
	return exp / xpToNextLVL * 100;
};

const getClassRaceTitle = (savedRaceClassObj: SavedRaceClassObj) => (
	savedRaceClassObj.savedRace + '-' + savedRaceClassObj.savedClassName +
	(savedRaceClassObj.savedSubClassName ? ` (${savedRaceClassObj.savedSubClassName})` : '')
);

const getIniciativeDiceCheck = (savedIni: number): DiceCheck => ({
	typeId: 0,
	value: {
		count: 1,
		edge: 20
	},
	modifiers: savedIni
});

export interface SegmentDerivedData {
	xpToNextLVL: number | undefined,
	expBarWidth: number,
	classRaceTitle: string,
	isMaxHP: boolean,
	isDead: boolean,
	iniciativeDiceCheck: DiceCheck,
	goldCoins: ReturnType<typeof numberToShortStringObj>,
	silverCoins: ReturnType<typeof numberToShortStringObj>,
	copperCoins: ReturnType<typeof numberToShortStringObj>
}

export interface DesktopSideData {
	info: {
		header: string;
		onChangeHeader?: (text: string) => void;
		avatar: React.ReactNode;
		alignment: React.ReactNode;
		levelExp: React.ReactNode;
	};
	characteristics: {
		armor: React.ReactNode;
		speed: React.ReactNode;
		raceClass: React.ReactNode;
		healthAndProf: React.ReactNode;
	};
	arsenal: {
		coins: React.ReactNode;
	};
	attacks: {
		initiativeAndInspiration: React.ReactNode;
	};
}

const getDerivedData = ({ character, savedRaceClassObj, iniciativeHandler }: GetSegmentsProps): SegmentDerivedData => {
	const xpToNextLVL = thatLevelLowBorder(character.info.level + 1);
	return {
		xpToNextLVL,
		expBarWidth: getExpBarWidth(character.info.exp, xpToNextLVL),
		classRaceTitle: getClassRaceTitle(savedRaceClassObj),
		isMaxHP: character.condition.health.current === character.condition.health.max,
		isDead: character.condition.health.isDying && character.condition.health.stabilization.fail === 3,
		iniciativeDiceCheck: getIniciativeDiceCheck(iniciativeHandler.savedIni),
		goldCoins: numberToShortStringObj(character.backpack.coins.gold),
		silverCoins: numberToShortStringObj(character.backpack.coins.silver),
		copperCoins: numberToShortStringObj(character.backpack.coins.copper)
	};
};

export const getSegments = (
	{
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
	}: GetSegmentsProps): HeadSegmentProps[] => {
	const segmentProps: GetSegmentsProps = {
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

	const derivedData = getDerivedData(segmentProps);

	return [
		getInfoSegment(segmentProps, derivedData),
		getCharacteristicsSegment(segmentProps, derivedData),
		getArsenalSegment(segmentProps, derivedData),
		getAttacksSegment(segmentProps, derivedData),
		getGroupSegment('4', 'notes', 'Заметки'),
		getGroupSegment('5', 'spells', 'Заклинания')
	];
};

export const getDesktopSideData = (props: GetSegmentsProps): DesktopSideData => {
	const derivedData = getDerivedData(props);
	const infoData = getInfoDesktopData(props, derivedData);
	const characteristicsData = getCharacteristicsDesktopData(props, derivedData);
	const arsenalSegment = getArsenalSegment(props, derivedData);
	const attacksSegment = getAttacksSegment(props, derivedData);

	return {
		info: {
			header: infoData.header,
			onChangeHeader: infoData.onChangeHeader,
			avatar: infoData.avatar,
			alignment: infoData.alignment,
			levelExp: infoData.levelExp
		},
		characteristics: {
			armor: characteristicsData.armor,
			speed: characteristicsData.speed,
			raceClass: characteristicsData.raceClass,
			healthAndProf: characteristicsData.healthAndProf
		},
		arsenal: {
			coins: arsenalSegment.bottomChildren ?? null
		},
		attacks: {
			initiativeAndInspiration: attacksSegment.bottomChildren ?? null
		}
	};
};