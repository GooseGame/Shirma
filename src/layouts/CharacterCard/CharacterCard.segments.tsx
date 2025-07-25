import React from 'react';
import { RoundButton, SquareButton } from '../../components/Button/Button';
import { EditCustomPopup } from '../../components/EditCustomPopup/EditCustomPopup';
import { NumberInput } from '../../components/NumberInput/NumberInput';
import { HeadSegmentProps } from '../../components/Playcard/HeadSegment/HeadSegment.props';
import { thatLevelLowBorder } from '../../helpers/experience';
import { numberToShortString, numberToShortStringObj } from '../../helpers/format';
import { Character } from '../../interfaces/Character.interface';
import { getEditRaceClassInputs, getIniciativeBody } from './CharacterCard.helpers';
import styles from './CharacterCard.module.css';
import cn from 'classnames';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import { EditCalcPopupCoins } from '../../components/EditCalcPopup/EditCalcPopup.coins';
import { EditCalcPopupExp } from '../../components/EditCalcPopup/EditCalcPopup.exp';
import { EditCalcPopupHealth } from '../../components/EditCalcPopup/EditCalcPopup.health';

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

interface GetSegmentsProps {
	character: Character,
	setPopupByStrings: (text: string, header: string)=>void,
	savedRaceClassObj: {
		savedRace: string,
		setSavedRace: React.Dispatch<React.SetStateAction<string>>,
		savedClassName: string,
		setSavedClassName: React.Dispatch<React.SetStateAction<string>>, 
		savedSubClassName: string|undefined,
		setSavedSubClassName: React.Dispatch<React.SetStateAction<string|undefined>>, 
		handleClickRaceClassText: ()=>void,
		isShowEditRaceClass: boolean,
		onCancelEditRaceClass: ()=>void,
		handleSaveRaceClassForm: () => void
	},
	onSaveCharName: (text: string)=>void,
	handleClickAlignment: ()=>void,
	armorHandlers: {
		onClickArmor: ()=>void,
		onMouseLeaveArmor: ()=>void,
		isFocusingArmor: boolean,
		onSaveArmor: (value: number)=>void
	},
	speedHandler: {
		onClickSpeed: ()=>void,
		onMouseLeaveSpeed: ()=>void,
		isFocusingSpeed: boolean,
		onSaveSpeed: (value: number)=>void
	},
	onClickInspiration: ()=>void,
	iniciativeHandler: {
		savedIni: number,
		setSavedIni: React.Dispatch<React.SetStateAction<number>>,
		isShowIniPopup: boolean,
		setIsShowIniPopup: React.Dispatch<React.SetStateAction<boolean>>,
		onCancelIniPopup: ()=>void,
		handleSaveIniPopup: ()=>void
	},
	setDiceRoll: React.Dispatch<React.SetStateAction<Damage[] | DiceCheck[]>> | undefined,
	profHandler: {
		isShowProfInput: boolean,
		setIsShowProfInput: React.Dispatch<React.SetStateAction<boolean>>,
		handleSaveProf: (value: number)=>void
	},
	coinsHandler: {
		isShowCoinsPopup: boolean,
		setShowCoinsPopup: React.Dispatch<React.SetStateAction<boolean>>,
		handleSaveCoins: (value: number, coinType: string) => void,
		onCancelCoinsPopup: ()=>void
	},
	expHandler: {
		isShowExpPopup: boolean,
		setShowExpPopup: React.Dispatch<React.SetStateAction<boolean>>,
		handleSaveExp: (value: number) => void,
		handleSaveLvl: (isLVLUp: boolean) => void,
		onCancelExpPopup: ()=>void,
		setLvl: (level: number) =>void
	},
	healthHandler: {
		isShowHealthPopup: boolean,
		setShowHealthPopup: React.Dispatch<React.SetStateAction<boolean>>,
		changeHealth: (value: number, type: 'extra' | 'default') => void,
		onClickStabilize: (stabilisationValue?: number, mode?: 'success' | 'fail') => void,
		changeMaxHP: (newValue: number) => void,
		changeHPDice: (value: number) => void
	},
	avaHandler: {
		isShowAvaPopup: boolean;
		setShowAvaPopup: React.Dispatch<React.SetStateAction<boolean>>;
		onSaveAvatar: (url: string) => void;
		avaUrl: string;
		setAvaUrl: React.Dispatch<React.SetStateAction<string>>;
	}
}
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
	const xpToNextLVL = thatLevelLowBorder(character.info.level+1);
	const goldCoins = numberToShortStringObj(character.backpack.coins.gold);
	const silverCoins = numberToShortStringObj(character.backpack.coins.silver);
	const copperCoins = numberToShortStringObj(character.backpack.coins.copper);
	const expBarWidth = (xpToNextLVL && character.info.exp < xpToNextLVL) ? character.info.exp / xpToNextLVL * 100 : 100;
	const isMaxHP = character.condition.health.current === character.condition.health.max;
	const isDead = character.condition.health.isDying && character.condition.health.stabilization.fail === 3;
	const classRaceTitle = savedRaceClassObj.savedRace+'-'+savedRaceClassObj.savedClassName + (savedRaceClassObj.savedSubClassName ? ` (${savedRaceClassObj.savedSubClassName})`:'');
	const iniciativeDiceCheck: DiceCheck = {
		typeId: 0,
		value: {
			count: 1,
			edge: 20
		},
		modifiers: iniciativeHandler.savedIni
	};

	return [
		{
			segmentId: '0',
			segmentName: 'info',
			header: character.info.name,
			classNames: styles['segment'],
			onChangeHeader: onSaveCharName,
			leftChildren:
				<div className={styles['avatar-wrapper']}>
					<img src={character.avatar} alt='Avatar' title={character.info.name} className={styles['avatar']} onClick={()=>avaHandler.setShowAvaPopup(true)}/>
				</div>,
			bottomChildren: 
				<div className={styles['bottom-container']}>
					<div className={styles['pre-bottom']} title={character.info.alignment.name} onClick={handleClickAlignment}>{character.info.alignment.name}</div>
					{avaHandler.isShowAvaPopup &&
						<EditCustomPopup
							header='Вставь url аватарки'
							onCancel={()=>{avaHandler.setShowAvaPopup(false); avaHandler.setAvaUrl(character.avatar);}}
							color='green' wrapperCN={cn(styles['green'], styles['small-popup'])}>
							<div className={styles['class-race-content']}>
								<img 
									src={avaHandler.avaUrl} 
									alt='тут должна появиться аватарка' 
									title='(это временно)'
									className={styles['ava']}/>
								<input 
									type='text' 
									className={cn(styles['text-input'], styles['ava-input'])} 
									value={avaHandler.avaUrl} 
									onChange={(e)=>avaHandler.setAvaUrl(e.target.value)}/>
								<div className={cn(styles['save-btn'], styles['save-brown'])} onClick={()=>avaHandler.onSaveAvatar(avaHandler.avaUrl)}>
									<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
								</div>
							</div>
						</EditCustomPopup>
					}
					{expHandler.isShowExpPopup && 
							<EditCalcPopupExp 
								header={character.info.name + ', ' + character.info.level + ' уровень'}
								onCancel={expHandler.onCancelExpPopup}
								setPopup={setPopupByStrings}
								onSave={expHandler.handleSaveExp}
								onLVLUp={expHandler.handleSaveLvl}
								color='darker-green'
								currExpInfo={{level: character.info.level, exp: character.info.exp}}
								setLvl={expHandler.setLvl}
								mode='exp'>
							</EditCalcPopupExp>}
					<div className={cn(styles['bottom-buttons'], styles['darker-brown'])} onClick={()=>expHandler.setShowExpPopup(true)}>
						<div className={cn(styles['exp-bar'], 'small-shadow')} style={{width: expBarWidth+'%'}}></div>
						<RoundButton classNames={styles['button-brown']}>
							<div className={styles['button-info']}>
								<span className={styles['big-button-text']}>
									{character.info.level}
								</span>
								<span className={styles['small-button-text']}>
									ур
								</span>
							</div>
						</RoundButton>
						<RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'])}>
							<div className={styles['button-info']}>
								<span className={styles['small-button-text']} title={character.info.exp.toString()}>
									{character.info.exp}
								</span>
								<span className={styles['big-button-text']} title={xpToNextLVL ? xpToNextLVL.toString() : 'Max lvl'}>
									/{xpToNextLVL ? numberToShortString(xpToNextLVL) : 'MAX'}
								</span>
							</div>
						</RoundButton>
					</div>
				</div>
		},
		{
			segmentId: '1',
			segmentName: 'characteristics',
			header: 'Характеристики',
			classNames: styles['segment'],
			leftChildren:
				<div className={styles['left-buttons']}>
					<SquareButton 
						onClick={armorHandlers.onClickArmor} 
						onMouseLeave={armorHandlers.onMouseLeaveArmor} 
						isBigShadow={false} 
						classNames={cn(styles['armor-button'], armorHandlers.isFocusingArmor ? styles['wider']: '')}
					>
						<div className={styles['vertical-button-info']}>
							<NumberInput 
								initialValue={character.condition.armor} 
								inputCN={cn(styles['armor-speed-input'], styles['bigger-button-text'])} 
								textCN={styles['bigger-button-text']} 
								buttonCN={styles['confirm-race-class']}
								onSave={armorHandlers.onSaveArmor}
								valMustBeGreaterZero
								imgBlack
							/>
							<span className={styles['small-button-text']}>
								защита
							</span>
						</div>
					</SquareButton>
					<SquareButton 
						onClick={speedHandler.onClickSpeed} 
						onMouseLeave={speedHandler.onMouseLeaveSpeed} 
						isBigShadow={false} 
						classNames={cn(styles['speed-button'], speedHandler.isFocusingSpeed ? styles['wider']: '')}
					>
						<div className={styles['vertical-button-info']}>
							<NumberInput 
								initialValue={character.condition.speed} 
								inputCN={cn(styles['armor-speed-input'], styles['bigger-button-text'])} 
								textCN={styles['bigger-button-text']} 
								buttonCN={styles['confirm-race-class']}
								onSave={speedHandler.onSaveSpeed}
								valMustBeGreaterZero
								imgBlack/>
							<span className={styles['small-button-text']}>
								скорость
							</span>
						</div>
					</SquareButton>
				</div>,
			bottomChildren:
				<div className={styles['bottom-container']}>
					<div className={styles['pre-bottom']} onClick={savedRaceClassObj.handleClickRaceClassText} title={classRaceTitle}>{classRaceTitle}</div>
					{savedRaceClassObj.isShowEditRaceClass && 
						<EditCustomPopup 
							wrapperCN={styles['class-race-wrapper']} 
							onCancel={savedRaceClassObj.onCancelEditRaceClass} 
							color={'darker-red'} 
							header='Раса, класс, подкласс'>
							{getEditRaceClassInputs({...savedRaceClassObj})}
						</EditCustomPopup>
					}
					{healthHandler.isShowHealthPopup &&
						<EditCalcPopupHealth
							header='Здоровье' 
							changeMaxHP={healthHandler.changeMaxHP}
							changeHPDice={healthHandler.changeHPDice}
							onCancel={()=>healthHandler.setShowHealthPopup(false)}
							setPopup={setPopupByStrings}
							color='darker-red'
							changeHealth={healthHandler.changeHealth}
							onClickStabilize={healthHandler.onClickStabilize}
							setDiceRoll={setDiceRoll}
							mode='health'
							currHealthInfo={{
								current: character.condition.health.current, 
								extra: character.condition.health.extra,
								max: character.condition.health.max,
								isDying: character.condition.health.isDying,
								stabilization: character.condition.health.stabilization,
								hpDiceEdge: character.condition.health.hpDice.edge
							}}
						>	
						</EditCalcPopupHealth>
					}
					<div className={styles['bottom-buttons']}>
						{!isDead &&
						<RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'])} onClick={()=>{healthHandler.setShowHealthPopup(true);}}>
							<div className={styles['button-info']} title={'Здоровье: '+character.condition.health.current+' из '+character.condition.health.max+(character.condition.health.extra>0 ? ' (+ '+character.condition.health.extra+' дополнительных) ':'')}>
								<span className={cn(styles['small-button-text'], isMaxHP ? styles['current-hp-text'] : styles['red-text'])}>
									{character.condition.health.current}
								</span>
								<span className={styles['big-button-text']}>
									/{character.condition.health.max}
								</span>
								{character.condition.health.extra > 0 && <span className={cn(styles['small-button-text'], styles['yellow-text'])}>
									{'('+character.condition.health.extra+')'}
								</span>}
							</div>
						</RoundButton>}
						{isDead && <RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'], styles['dead'])} onClick={()=>{healthHandler.setShowHealthPopup(true);}}>
							<div className={cn(styles['button-info'])} title='Умер'>
								<img src='/dead.svg' alt='umer'/>
							</div>
						</RoundButton>}
						
						<RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'])}>
							<div 
								className={cn(styles['button-info'], styles['horizontal-btn-info'])} 
								onClick={()=>profHandler.setIsShowProfInput(true)} 
							>
								{!profHandler.isShowProfInput && <span className={styles['big-button-text']}>+</span>}
								<NumberInput 
									initialValue={character.proficiency} 
									inputCN={cn(styles['armor-speed-input'],styles['prof-input'], styles['bigger-button-text'])} 
									textCN={styles['big-button-text']} 
									buttonCN={styles['confirm-race-class']}
									onSave={profHandler.handleSaveProf}
									valMustBeGreaterZero
									isParentFocus={profHandler.isShowProfInput}
									setIsParentFocus={profHandler.setIsShowProfInput}
									imgBlack/>
								{!profHandler.isShowProfInput && <span className={cn(styles['small-button-text'], styles['prof-label'])}>
									{' Владение'}
								</span>}
							</div>
						</RoundButton>
					</div>
				</div>
		},
		{
			segmentId: '2',
			segmentName: 'arsenal',
			header: 'Снаряжение',
			classNames: styles['segment'],
			bottomChildren:
				<div className={styles['bottom-container']}>
					{coinsHandler.isShowCoinsPopup && 
					<EditCalcPopupCoins 
						header='Посчитать мелочь'
						onCancel={coinsHandler.onCancelCoinsPopup}
						setPopup={setPopupByStrings}
						onSaveCoins={coinsHandler.handleSaveCoins}
						color='darker-brown'
						mode='coins'>
					</EditCalcPopupCoins>}
					<div className={styles['bottom-buttons']} onClick={()=>coinsHandler.setShowCoinsPopup(true)}>
						<RoundButton classNames={cn(styles['coin'], styles['gold'])}>
							<div className={styles['button-info']}>
								<span className={styles['big-button-text']}>
									{goldCoins.value}
								</span>
								{goldCoins.mult && <span className={styles['small-button-text']}>
									{goldCoins.mult}
								</span>}
							</div>
						</RoundButton>
						<RoundButton classNames={cn(styles['coin'], styles['silver'])}>
							<div className={styles['button-info']}>
								<span className={styles['big-button-text']}>
									{silverCoins.value}
								</span>
								{silverCoins.mult && <span className={styles['small-button-text']}>
									{silverCoins.mult}
								</span>}
							</div>
						</RoundButton>
						<RoundButton classNames={cn(styles['coin'], styles['copper'])}>
							<div className={styles['button-info']}>
								<span className={styles['big-button-text']}>
									{copperCoins.value}
								</span>
								{copperCoins.mult && <span className={styles['small-button-text']}>
									{copperCoins.mult}
								</span>}
							</div>
						</RoundButton>
					</div>
				</div>
		},
		{
			segmentId: '3',
			segmentName: 'attacks',
			header: 'Атаки',
			classNames: styles['segment'],
			bottomChildren:
				<div className={styles['bottom-container']}>
					{iniciativeHandler.isShowIniPopup && 
						<EditCustomPopup
							wrapperCN={styles['ini-wrapper']} 
							onCancel={iniciativeHandler.onCancelIniPopup} 
							color={'blue'} 
							header='Инициатива'>
							{getIniciativeBody({savedIni: iniciativeHandler.savedIni, setSavedIni: iniciativeHandler.setSavedIni, handleSave: iniciativeHandler.handleSaveIniPopup})}
						</EditCustomPopup>}
					<div className={styles['bottom-buttons']}>
						<RoundButton classNames={cn(styles['insp-btn'], !character.condition.inspiration ? styles['off']:'')} title={character.condition.inspiration ? 'Вдохновлён' : 'Нет вдохновления'} onClick={onClickInspiration}>
							{character.condition.inspiration && <img className={styles['insp-image']} src='/saint.svg' alt='inspired'/>}
							{!character.condition.inspiration && <img className={styles['insp-image']} src='/non-saint.svg' alt='inspired'/>}
						</RoundButton>
						<RoundButton onClick={()=>iniciativeHandler.setIsShowIniPopup(true)} classNames={cn(styles['button-brown'], styles['expandable-round-button'])}>
							<div className={styles['button-info']}>
								<span className={styles['big-button-text']}>
									{character.condition.initiative > 0 ? '+' : character.condition.initiative === 0 ? '' : ''}{character.condition.initiative}
								</span>
								<span className={cn(styles['small-button-text'], styles['ini-text'])}>
									{' инициатива'}
								</span>
							</div>
						</RoundButton>
						<div 
							title='Кинуть на инициативу' 
							onClick={()=>setDiceRoll?setDiceRoll([iniciativeDiceCheck]):''} 
							className={cn(styles['dice-btn'], 'small-shadow')}
						>
							<img src='/d20.svg' alt='roll' className={styles['aim-img']}/>
						</div>
					</div>
				</div>
		},
		{
			segmentId: '4',
			segmentName: 'notes',
			header: 'Заметки',
			groupable: true,
			classNames: cn(styles['segment'], styles['group-segment'])
		},
		{
			segmentId: '5',
			segmentName: 'spells',
			header: 'Заклинания',
			groupable: true,
			classNames: cn(styles['segment'], styles['group-segment'])
		}
	];
};