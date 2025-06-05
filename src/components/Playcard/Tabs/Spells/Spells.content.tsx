import { associativeCells, CellsByLevel, Character } from '../../../../interfaces/Character.interface';
import { Sticker } from '../../Sticker/Sticker';
import styles from './Spells.module.css';
import React from 'react';
import cn from 'classnames';
import { Spell } from '../../../../interfaces/spells.interface';
import { StickerList } from '../../../StickerList/StickerList';
import { RichText } from '../../../RichText/RichText';
import { Damage, DiceCheck } from '../../../../interfaces/Equipment.interface';
import wStyles from '../../WeaponItem/WeaponItem.module.css';
import { handleAimClick, handleDamageClick } from '../../../../helpers/attributes';
import { randomHash } from '../../../../helpers/random';
import { NumberInput } from '../../../NumberInput/NumberInput';

const emptyCellSrc = '/cell-empty2.svg';
const cellSrc = '/cell.svg';

export function getCellsSticker(player: Character, onClickAvailibleExtraCell: (key: string, lvl: number, availible: number) => void, onClickCell?: (lvl: number, availible: number) => void, onClickEditCell?: (lvl: number)=>void) {
	return <Sticker 
		header='Ячейки'
		stickerStyle='metal'
		width={0.33}
		fullHeight
		scrollable
		stickerCN={styles['cells-sticker']}
		bodyContent={
			{
				type: 'list',
				children: <div className={styles['lines']}>
					{player.spells.cells.map((cellLine, index) => (
						getCellLine(cellLine, index, false, onClickCell, onClickEditCell, player.spells.extraCells, onClickAvailibleExtraCell)))}
				</div>
			}
		}
	/>;
}

export const getExtraCellsByLevel = (extraCells: associativeCells|undefined, index: number, src: string, onCLickExtraCell: (key: string, lvl: number, availible: number) => void) => {
	if (!extraCells) return undefined;
	const cells = [];
	if (extraCells[src]?.cells[index]) {
		let cellsThisLevelCount = 0;
		for (let cellI = 0; cellI < extraCells[src].cells[index].count; cellI++) {
			const thatCellSrc = cellsThisLevelCount < extraCells[src].cells[index].availible?'/'+src:emptyCellSrc;
			cells.push(
				<img 
					src={thatCellSrc}
					className={styles['cell']}
					key={src+'-'+index+'-'+cellI}
					alt='multiclass Cell'
					onClick={()=>onCLickExtraCell(src, index, thatCellSrc===emptyCellSrc? cellI+1:cellI)}
				/>
			);
			cellsThisLevelCount++;
		}
	}
	return cells;
};

export function getSpellsOfLevel(spells: Spell[], level: number) {
	return spells.filter(spell => spell.level === level);
}

export function getCellLine(
	cellLine: CellsByLevel, 
	index: number,  
	onlyCells: boolean = false, 
	onClickCell?: (lvl: number, availible: number) => void,
	onClickEditCell?: (lvl: number, multiclass?: string)=>void,
	extraCells?: associativeCells,
	onCLickExtraCell?: (key: string, lvl: number, availible: number)=>void,
	multiclassSrc?: string
)
{
	const cells = [];
	const cellLineHash = randomHash();
	for (let i = 0; i < cellLine.count; i++) {
		cells.push(
			<img src={cells.length < cellLine.availible ? multiclassSrc ? multiclassSrc : cellSrc : emptyCellSrc} 
				alt='cell' 
				key={`cell${i}${cellLineHash}`}
				className={styles['cell']}
				onClick={() => {if (onClickCell) {cellLine.availible <= i ? onClickCell(index, i+1) : onClickCell(index, i);}}}
			/>
		);
	}
	const extraCellsObj: {cells: JSX.Element[], src: string}[] = [];
	if (onCLickExtraCell) {
		for (const src in extraCells) {
			const extraCellsImg = getExtraCellsByLevel(extraCells, index, src, onCLickExtraCell);
			if (extraCellsImg && extraCellsImg.length > 0) {
				extraCellsObj.push({cells: extraCellsImg, src});
			}
		}
	}

	if (onlyCells) return cells;
	return <div className={cn(styles['cell-line'], styles['metal-shading'])} key={index}>
		<div className={styles['cl-left']}>
			{index+1}
		</div>
		<div className={styles['cells-right']}>
			<div className={styles['cells-level-line']}>
				<img src='/cell-settings.svg'
					alt='cell' 
					key={'cell-settings'}
					className={styles['cell']}
					onClick={() => {if (onClickEditCell)onClickEditCell(index);}}
				/>
				{cells}
			</div>
			{extraCellsObj.length > 0 && 
				extraCellsObj.map(el => {
					return <div className={styles['cells-level-line']} key={el.src+index}>
						<img src='/cell-settings.svg'
							alt='cell' 
							key={'cell-settings'}
							className={styles['cell']}
							onClick={() => {if (onClickEditCell)onClickEditCell(index, el.src);}}
						/>
						{el.cells}
					</div>;
				})
			}
		</div>
	</div>;
}

export function getSpellInfoSticker(
	playerSpellStat: string,
	playerStatOptions: string[],
	onChangeSpellStat: (stat: string)=>void,

	saveRollValue: number,
	onSaveSaveRoll: (value: number)=>void,

	spellAimModifier: number,
	onSaveModifier: (value: number)=>void
) {
	return <Sticker
		width={0.5}
		stickerStyle='metal'
		header='Характеристики'
		headerCN={styles['spell-header']}
		stickerCN={cn(styles['cells-sticker'], styles['spell-sticker'])}
		bodyContent={
			{
				type: 'list',
				children: <div className={styles['spell-info-desc']}>
					<div className={cn(styles['spell-info-wrapper'], styles['player-spell-characteristics'])}>
						<div className={styles['edit-player-spell-info']}>Характеристика заклинаний</div>
						<select 
							className={styles['select-spell-stat']} 
							value={playerSpellStat} 
							onChange={e => onChangeSpellStat(e.target.value)}>
							{playerStatOptions.map(stat => (
								<option value={stat} key={stat}>{stat}</option>
							))}
						</select> 
					</div>
					<div className={cn(styles['spell-info-wrapper'], styles['player-spell-characteristics'])}>
						<div className={styles['edit-player-spell-info']}>Спас бросок</div>
						<NumberInput 
							initialValue={saveRollValue} 
							inputCN={cn(styles['spell-input'], styles['bigger-button-text'])}
							textCN={cn(styles['spell-input-text'], styles['bigger-button-text'])} 
							wrapperCN={styles['spells-input-wrapper']}
							buttonCN={styles['confirm-change-input']}
							onSave={onSaveSaveRoll}></NumberInput>
					</div>
					<div className={cn(styles['spell-info-wrapper'], styles['player-spell-characteristics'])}>
						<div className={styles['edit-player-spell-info']}>Модификатор</div>
						<NumberInput 
							initialValue={spellAimModifier} 
							inputCN={cn(styles['spell-input'], styles['bigger-button-text'])}
							textCN={cn(styles['spell-input-text'], styles['bigger-button-text'])} 
							wrapperCN={styles['spells-input-wrapper']}
							buttonCN={styles['confirm-change-input']}
							onSave={onSaveModifier}></NumberInput>
					</div>
				</div>
			}
		}
	></Sticker>;
}

export function getSpellsSticker(
	spells: Spell[], 
	cells: CellsByLevel, 
	level: number, 
	key: string, 
	setDiceRoll: React.Dispatch<React.SetStateAction<Damage[] | DiceCheck[]>>, 
	modifier: number, 
	onChangeCell?: (lvl: number, availible: number) => void,
	fillSpellParamsToPopup?: (level?: number, spell?: Spell)=>void) 
{
	return <Sticker 
		width={0.5} 
		key={key} 
		stickerStyle='metal' 
		fullHeight
		headerCN={styles['spell-header']}
		stickerCN={cn(styles['cells-sticker'], styles['spell-sticker'])}
		afterHeaderEl={getCellHeader(cells, level, onChangeCell)} 
		bodyContent={
			{
				type: 'list',
				children: <>
					{spells.map(spell => (getSpellBody(spell, setDiceRoll, modifier, fillSpellParamsToPopup)))}
					<button className={cn(styles['add-spell-by-level'])} onClick={()=>{if(fillSpellParamsToPopup)fillSpellParamsToPopup(level);}}>
						<img src='/plus.svg' alt='Add spell' title='Добавить заклинание' className={styles['add-spell-img']}/>
					</button>
				</>
			}
		}
	/>;
}

function getSpellBody(
	spell: Spell, 
	setDiceRoll: React.Dispatch<React.SetStateAction<Damage[] | DiceCheck[]>>, 
	modifier: number,
	fillSpellParamsToPopup?: (level?: number, spell?: Spell)=>void
) {
	const spellHash = randomHash();
	return <StickerList 
		headCN={styles['spell-title']}
		listStyle='metal'
		key={spell.name+spellHash}
		header={spell.name}
		afterHeaderEl={<img src='/settings-gray.svg' 
			alt='edit spell' 
			key={'edit-spell'}
			className={styles['edit-spell']}
			onClick={()=>{if(fillSpellParamsToPopup)fillSpellParamsToPopup(spell.level, spell);}}
		/> }
		descriptionCN={styles['spell-info-desc']}
		desc={
			{
				type: 'node',
				childrem: <>
					{(spell.aim || spell.damageRoll) && 
						<div className={styles['spell-info-wrapper']}>
							{spell.aim && 
								<div onClick={()=>handleAimClick(modifier, setDiceRoll)} className={cn(wStyles['metal'], wStyles['btn'], wStyles['prof'], 'small-shadow')}>
									<span className={cn(wStyles['text'], wStyles['prof'])}>
										{modifier >= 0 ? `+${modifier}` : `-${modifier}`}
									</span>
									<img className={wStyles['aim-img']} src='/aim-white.svg' alt='aim'/>
								</div>
							}
							{spell.damageRoll &&
								<div onClick={()=>spell.damageRoll ? handleDamageClick(spell.damageRoll, setDiceRoll) : ''} className={cn(wStyles['metal'], wStyles['btn'], wStyles['roll'], 'small-shadow')}>
									<img src='/d20.svg' alt='roll' className={wStyles['aim-img']}/>
								</div>
							}
						</div>
					}
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-label']}>
							Дистанция:
						</div>
						<div className={styles['spell-info-value']}>
							{spell.distance}
						</div>
					</div>
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-label']}>
							Длительность:
						</div>
						<div className={styles['spell-info-value']}>
							{spell.duration}
						</div>
					</div>
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-label']}>
							Время каста:
						</div>
						<div className={styles['spell-info-value']}>
							{spell.castTime}
						</div>
					</div>
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-label']}>
							Компоненты:
						</div>
						<div className={styles['spell-info-value']}>
							{spell.components.map(component => (
								component.extra ? 
									<span key={`${component.fullName}-${spellHash}`} className={cn(styles['component'], styles['comp-hint'])} title={component.extra}>{component.fullName} (?)</span>
									: <span key={`${component.fullName}-${spellHash}`} className={styles['component']}>{component.fullName}</span>
							))}
						</div>
					</div>
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-label']}>
							Требуется концентрация:
						</div>
						<div className={styles['spell-info-value']}>
							{spell.concentration ? 'Да' : 'Нет'}
						</div>
					</div>
					<RichText classNames={styles['rich-text-wrapper']} text={spell.description}/>
					<div className={styles['spell-info-wrapper']}>
						<div className={styles['spell-info-value']}>
							{spell.availibleFor.map(playerClass => (
								<div key={`${playerClass.name}-${spellHash}`} className={styles['availible-for']}>
									{playerClass.name}
								</div>
							))}
						</div>
					</div>
				</>
			}
		}
	/>;
}

function getCellHeader(cells: CellsByLevel, level: number, onChangeCell?: (lvl: number, availible: number) => void) {
	const cellsHeader = level === 0 ? 
		<img src={emptyCellSrc} 
			alt='cell' 
			key={'cell-free'}
			className={styles['cell']}
		/> 
		: <div className={styles['cl-right']}>{getCellLine(cells, 0, true, onChangeCell)}</div>;

	return <div className={cn(styles['cell-line'], styles['metal-shading'])}>
		<div className={styles['cl-left']}>
			{level === 0 ? 'Заговоры' : level}
		</div>
		<div className={styles['cl-right']}>
			{cellsHeader}
		</div>
	</div>;
}