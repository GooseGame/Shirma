import { RoundButton, SquareButton } from '../../components/Button/Button';
import { EditCustomPopup } from '../../components/EditCustomPopup/EditCustomPopup';
import { HeadSegmentProps } from '../../components/Playcard/HeadSegment/HeadSegment.props';
import { numberToShortString } from '../../helpers/format';
import { EditCalcPopupCoins } from '../../components/EditCalcPopup/EditCalcPopup.coins';
import { EditCalcPopupExp } from '../../components/EditCalcPopup/EditCalcPopup.exp';
import { EditCalcPopupHealth } from '../../components/EditCalcPopup/EditCalcPopup.health';
import { getEditRaceClassInputs, getEditableValueBody, getIniciativeBody } from './CharacterCard.helpers';
import styles from './CharacterCard.module.css';
import cn from 'classnames';
import { ReactNode } from 'react';
import type { GetSegmentsProps, SegmentDerivedData } from './CharacterCard.segments';

const renderCoinButton = (value: string | number, mult: string | number | undefined, className: string) => (
	<RoundButton classNames={cn(styles['coin'], className)}>
		<div className={styles['button-info']}>
			<span className={styles['big-button-text']}>
				{value}
			</span>
			{mult && <span className={styles['small-button-text']}>
				{mult}
			</span>}
		</div>
	</RoundButton>
);

export const getGroupSegment = (segmentId: string, segmentName: 'notes' | 'spells', header: string): HeadSegmentProps => ({
	segmentId,
	segmentName,
	header,
	groupable: true,
	classNames: cn(styles['segment'], styles['group-segment'])
});

export interface InfoDesktopData {
	header: string;
	onChangeHeader?: (text: string)=>void;
	avatar: ReactNode;
	alignment: ReactNode;
	levelExp: ReactNode;
	bottom: ReactNode;
}

export interface CharacteristicsDesktopData {
	armorAndSpeed: ReactNode;
	raceClass: ReactNode;
	healthAndProf: ReactNode;
	bottom: ReactNode;
}

export interface ArsenalDesktopData {
	coins: ReactNode;
}

export interface AttacksDesktopData {
	initiativeAndInspiration: ReactNode;
}

const getHealthBarWidths = (currentHealth: number, extraHealth: number, maxHealth: number) => {
	if (maxHealth <= 0) {
		return { currentPercent: 0, extraPercent: 0 };
	}
	const currentPercent = Math.max(0, Math.min(100, currentHealth / maxHealth * 100));
	const extraCapPercent = Math.max(0, 100 - currentPercent);
	const extraPercent = Math.max(0, Math.min(extraCapPercent, extraHealth / maxHealth * 100));
	return { currentPercent, extraPercent };
};

export const getInfoDesktopData = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
): InfoDesktopData => {
	const { character, onSaveCharName, avaHandler, handleClickAlignment, expHandler, setPopupByStrings } = props;
	const { expBarWidth, xpToNextLVL } = derivedData;
	const avatar =
		<div className={styles['avatar-wrapper']}>
			<img src={character.avatar} alt='Avatar' title={character.info.name} className={styles['avatar']} onClick={()=>avaHandler.setShowAvaPopup(true)}/>
		</div>;
	const alignment = (
		<>
			<div className={styles['pre-bottom']} title={character.info.alignment.name} onClick={handleClickAlignment}>{character.info.alignment.name}</div>
			{avaHandler.isShowAvaPopup &&
				<EditCustomPopup
					header='Вставь url аватарки'
					onCancel={()=>{avaHandler.setShowAvaPopup(false); avaHandler.setAvaUrl(character.avatar);}}
					color='green' wrapperCN={cn(styles['green'], styles['small-popup'])}>
					<div className={styles['class-race-content']}>
						<img src={avaHandler.avaUrl} alt='тут должна появиться аватарка' title='(это временно)' className={styles['ava']}/>
						<input type='text' className={cn(styles['text-input'], styles['ava-input'])} value={avaHandler.avaUrl} onChange={(e)=>avaHandler.setAvaUrl(e.target.value)}/>
						<div className={cn(styles['save-btn'], styles['save-brown'])} onClick={()=>avaHandler.onSaveAvatar(avaHandler.avaUrl)}>
							<img src='/more-white.svg' alt='confirm' className={styles['save-img']}/>
						</div>
					</div>
				</EditCustomPopup>
			}
		</>
	);
	const levelExp = (
		<>
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
				<RoundButton classNames={styles['button-brown']}><div className={styles['button-info']}><span className={styles['big-button-text']}>{character.info.level}</span><span className={styles['small-button-text']}>ур</span></div></RoundButton>
				<RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'])}><div className={styles['button-info']}><span className={styles['small-button-text']} title={character.info.exp.toString()}>{character.info.exp}</span><span className={styles['big-button-text']} title={xpToNextLVL ? xpToNextLVL.toString() : 'Max lvl'}>/{xpToNextLVL ? numberToShortString(xpToNextLVL) : 'MAX'}</span></div></RoundButton>
			</div>
		</>
	);
	const bottom = <div className={styles['bottom-container']}>{alignment}{levelExp}</div>;

	return {
		header: character.info.name,
		onChangeHeader: onSaveCharName,
		avatar,
		alignment,
		levelExp,
		bottom
	};
};

export const getInfoSegment = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
): HeadSegmentProps => {
	const infoData = getInfoDesktopData(props, derivedData);

	return {
		segmentId: '0',
		segmentName: 'info',
		header: infoData.header,
		classNames: styles['segment'],
		onChangeHeader: infoData.onChangeHeader,
		leftChildren: infoData.avatar,
		bottomChildren: infoData.bottom
	};
};

export const getCharacteristicsSegment = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
): HeadSegmentProps => {
	const { character, savedRaceClassObj, healthHandler, setPopupByStrings, setDiceRoll } = props;
	const { classRaceTitle, isDead, isMaxHP } = derivedData;
	const { currentPercent, extraPercent } = getHealthBarWidths(
		character.condition.health.current,
		character.condition.health.extra,
		character.condition.health.max
	);
	const raceClassContent = (
		<>
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
		</>
	);
	const healthAndProfContent = (
		<>
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
			<div className={styles['bottom-buttons']} onClick={()=>{healthHandler.setShowHealthPopup(true);}}>
				<div className={cn(styles['health-bar-main'], extraPercent > 0 ? styles['right-no-radius'] : '')} style={{ width: currentPercent + '%' }}></div>
				<div
					className={styles['health-bar-extra']}
					style={{ left: currentPercent + '%', width: extraPercent + '%' }}
				></div>
				{!isDead && <RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'], styles['health-left-btn'])}>
					<div className={styles['button-info']} title={'Здоровье: '+character.condition.health.current+' из '+character.condition.health.max+(character.condition.health.extra>0 ? ' (+ '+character.condition.health.extra+' дополнительных) ':'')}>
						<span className={cn(styles['small-button-text'], isMaxHP ? styles['current-hp-text'] : styles['red-text'])}>
							{character.condition.health.current}
						</span>
						{character.condition.health.extra > 0 && <span className={cn(styles['small-button-text'], styles['yellow-text'])}>
							{' (+ '+character.condition.health.extra+')'}
						</span>}
					</div>
				</RoundButton>}
				{isDead && <RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'], styles['dead'], styles['health-left-btn'])}>
					<div className={cn(styles['button-info'])} title='Умер'>
						<img src='/dead.svg' alt='umer'/>
					</div>
				</RoundButton>}
				<RoundButton classNames={cn(styles['button-brown'], styles['expandable-round-button'], styles['health-right-btn'])}>
					<div className={styles['button-info']}>
						<span className={styles['big-button-text']}>
							{character.condition.health.max}
						</span>
					</div>
				</RoundButton>
			</div>
		</>
	);
	const characteristicsBottomContent = (
		<div className={styles['bottom-container']}>
			{raceClassContent}
			{healthAndProfContent}
		</div>
	);

	return {
		segmentId: '1',
		segmentName: 'characteristics',
		header: 'Характеристики',
		classNames: styles['segment'],
		bottomChildren: characteristicsBottomContent
	};
};

export const getCharacteristicsDesktopData = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
) => {
	const { character, armorHandlers, speedHandler } = props;
	const characteristicsSegment = getCharacteristicsSegment(props, derivedData);
	const element = characteristicsSegment.bottomChildren as ReactNode;
	let raceClass: ReactNode = null;
	let healthAndProf: ReactNode = null;
	if (element && typeof element === 'object' && 'props' in (element as object)) {
		const children = (element as { props?: { children?: ReactNode } }).props?.children;
		const childrenArray = Array.isArray(children) ? children : [children];
		raceClass = childrenArray[0] ?? null;
		healthAndProf = childrenArray[1] ?? null;
	}
	const armor = <>
		{armorHandlers.isShowArmorPopup &&
			<EditCustomPopup
				wrapperCN={styles['ini-wrapper']}
				onCancel={armorHandlers.onCancelArmorPopup}
				color={'darker-red'}
				header='Защита'>
				{getEditableValueBody({
					value: armorHandlers.savedArmor,
					setValue: armorHandlers.setSavedArmor,
					handleSave: armorHandlers.handleSaveArmorPopup
				})}
			</EditCustomPopup>}
		<SquareButton
			onClick={()=>armorHandlers.setIsShowArmorPopup(true)}
			isBigShadow={false}
			classNames={styles['armor-button']}
		>
			<div className={styles['vertical-button-info']}>
				<div className={styles['bigger-button-text']}>{character.condition.armor}</div>
				<span className={styles['small-button-text']}>
					защита
				</span>
			</div>
		</SquareButton>
	</>;
	const speed = <>
		{speedHandler.isShowSpeedPopup &&
			<EditCustomPopup
				wrapperCN={styles['ini-wrapper']}
				onCancel={speedHandler.onCancelSpeedPopup}
				color={'darker-red'}
				header='Скорость'>
				{getEditableValueBody({
					value: speedHandler.savedSpeed,
					setValue: speedHandler.setSavedSpeed,
					handleSave: speedHandler.handleSaveSpeedPopup
				})}
			</EditCustomPopup>}
		<SquareButton
			onClick={()=>speedHandler.setIsShowSpeedPopup(true)}
			isBigShadow={false}
			classNames={styles['speed-button']}
		>
			<div className={styles['vertical-button-info']}>
				<div className={styles['bigger-button-text']}>{character.condition.speed}</div>
				<span className={styles['small-button-text']}>
					скорость
				</span>
			</div>
		</SquareButton>
	</>;
	return { armor, speed, raceClass, healthAndProf };
};

export const getArsenalSegment = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
): HeadSegmentProps => {
	const { coinsHandler, setPopupByStrings } = props;
	const { goldCoins, silverCoins, copperCoins } = derivedData;
	const coinsContent =
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
				{renderCoinButton(goldCoins.value, goldCoins.mult, styles['gold'])}
				{renderCoinButton(silverCoins.value, silverCoins.mult, styles['silver'])}
				{renderCoinButton(copperCoins.value, copperCoins.mult, styles['copper'])}
			</div>
		</div>;

	return {
		segmentId: '2',
		segmentName: 'arsenal',
		header: 'Снаряжение',
		classNames: styles['segment'],
		bottomChildren: coinsContent
	};
};

export const getAttacksSegment = (
	props: GetSegmentsProps,
	derivedData: SegmentDerivedData
): HeadSegmentProps => {
	const { character, iniciativeHandler, onClickInspiration, setDiceRoll } = props;
	const { iniciativeDiceCheck } = derivedData;
	const initiativeAndInspirationContent =
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
		</div>;

	return {
		segmentId: '3',
		segmentName: 'attacks',
		header: 'Атаки',
		classNames: styles['segment'],
		bottomChildren: initiativeAndInspirationContent
	};
};
