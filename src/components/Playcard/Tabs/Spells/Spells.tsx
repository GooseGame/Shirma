/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch } from 'react-redux';
import { TabsProps } from '../Tabs.props';
import { getCellLine, getCellsSticker, getSpellInfoSticker, getSpellsOfLevel, getSpellsSticker } from './Spells.content';
import styles from './Spells.module.css';
import { AppDispatch } from '../../../../store/store';
import { charActions } from '../../../../store/slices/Characters.slice';
import { useState } from 'react';
import { associativeCells } from '../../../../interfaces/Character.interface';
import { EditCustomPopup } from '../../../EditCustomPopup/EditCustomPopup';
import cn from 'classnames';
import { cellsColorObj } from '../../../../helpers/createSpell';
import { SquareButton } from '../../../Button/Button';
import { Spell } from '../../../../interfaces/spells.interface';
import { EditSpellPopup } from './Spells.editSpellPopup';

export function Spells({player, setDiceRoll, onChangeChar}: TabsProps) {
	const playerSpells = player.spells;
	const freeSpells = getSpellsOfLevel(playerSpells.spells, 0);
	const dispatch = useDispatch<AppDispatch>();
	const [isOpenCellsPopup, setOpenCellsPopup] = useState(false);
	const [clickedLine, setClickedLine] = useState(0);
	const [chosenClass, setChosenClass] = useState<{src:string, title:string}>();
	const [chosenMulticlass, setChosenMulticlass] = useState<string>();
	const [associativeCharCells, setAssociativeCharCells] = useState(
		player.spells.extraCells ?? {}
	);

	const [isOpenSpellPopup, setOpenSpellPopup] = useState(false);
	const [chosenSpell, setChosenSpell] = useState<Spell>();
	const [chosenSpellLvl, setChosenSpellLvl] = useState<number>();
	const playerStats = player.stats.map(stat=>{return stat.name;});

	const onChangeSpellStat = (statValue: string) => {
		if (statValue === player.spells.spellsStat) return;
		dispatch(charActions.setSpellStat({id: player.id, value: statValue}));
		const playerAimStat = player.stats.find(stat => stat.name === statValue);
		if (playerAimStat) {
			dispatch(charActions.setSpellModifier({id: player.id, value: playerAimStat.modifier+player.proficiency}));
			dispatch(charActions.setSpellSaveRoll({id: player.id, value: 10+playerAimStat.modifier}));
		}
		//TODO: пофиксить этот костыль
		window.location.reload();
	};

	const onSaveSaveRoll = (saveRollValue: number) => {
		if (saveRollValue > -1 && saveRollValue < 99) {
			dispatch(charActions.setSpellSaveRoll({id: player.id, value: saveRollValue}));
			if (onChangeChar) onChangeChar();
		}
	};

	const onSaveSpellModifier = (spellAimModifier: number) => {
		if (spellAimModifier > -99 && spellAimModifier < 99) {
			dispatch(charActions.setSpellModifier({id: player.id, value: spellAimModifier}));
			if (onChangeChar) onChangeChar();
		}
	};

	const onClickRemoveMulticlassCellLine = () => {
		if (!associativeCharCells || !chosenMulticlass || !associativeCharCells[chosenMulticlass]) return;
		if (!Array.isArray(associativeCharCells[chosenMulticlass]?.cells)) return;
		const newAssCharCells = {
			...associativeCharCells,
			[chosenMulticlass]: {
				...associativeCharCells[chosenMulticlass],
				cells: [...associativeCharCells[chosenMulticlass].cells] // Копируем массив
			}
		};
	
		// Удаляем нужный элемент
		newAssCharCells[chosenMulticlass].cells = 
			newAssCharCells[chosenMulticlass].cells.filter((_, index) => index !== clickedLine);
	
		// Если массив cells пуст - удаляем весь класс
		if (newAssCharCells[chosenMulticlass].cells.length === 0) {
			const { [chosenMulticlass]: _, ...rest } = newAssCharCells;
			dispatch(charActions.setExtraCells({
				id: player.id, 
				value: Object.keys(rest).length ? rest : undefined
			}));
			setAssociativeCharCells(Object.keys(rest).length ? rest : {});
		} else {
			dispatch(charActions.setExtraCells({
				id: player.id, 
				value: newAssCharCells
			}));
			setAssociativeCharCells(newAssCharCells);
		}
	
		onCancelChangeExtraCells();
	};

	const onClickCell = (lvl: number, availible: number) => {
		dispatch(charActions.setCellsAvailible({id: player.id, value: availible, lvl: lvl}));
		if (onChangeChar) onChangeChar();
	};
	const onClickAddCell = (lvl: number, count: number, setAsAvailible: boolean) => {
		if (count >= 10) return;
		if (!chosenMulticlass) {
			dispatch(charActions.setCellsCount({id: player.id, value: count, lvl: lvl, setAsAvailible}));
			if (onChangeChar) onChangeChar();
		} else {
			if (associativeCharCells && associativeCharCells[chosenMulticlass] && associativeCharCells[chosenMulticlass].cells[clickedLine]) {
				const newAssCharCells = {
					...associativeCharCells,
					[chosenMulticlass]: {
						...associativeCharCells[chosenMulticlass],
						cells: associativeCharCells[chosenMulticlass].cells.map((el, index) => {
							if (index !== clickedLine) return el;
							return {count, availible: count};
						})
					}
				};
				setAssociativeCharCells(newAssCharCells);
				onClickChangeExtraCells(newAssCharCells);
			}
		}
	};
	const onClickAvailibleExtraCell = (key: string, lvl: number, availible: number) => {
		if (!player.spells.extraCells || !player.spells.extraCells[key] || !player.spells.extraCells[key].cells[lvl]) return;
		const resultExtraCells = player.spells.extraCells;
		resultExtraCells[key].cells[lvl] = {count: resultExtraCells[key].cells[lvl].count, availible};
		dispatch(charActions.setExtraCells({id: player.id, value: resultExtraCells}));
		if (onChangeChar) onChangeChar();
	};

	const onClickChangeExtraCells = (value: associativeCells) => {
		dispatch(charActions.setExtraCells({id: player.id, value}));
		if (onChangeChar) onChangeChar();
	};
	const onCancelChangeExtraCells = () => {
		if (chosenClass && associativeCharCells) {
			dispatch(charActions.setExtraCells({
				id: player.id, 
				value: associativeCharCells
			}));
		}
		
		setOpenCellsPopup(false);
		setClickedLine(0);
		setChosenClass(undefined);
		setChosenMulticlass(undefined);
		
		// Всегда синхронизируем с Redux, даже если undefined
		setAssociativeCharCells(player.spells.extraCells ?? {});
		
		if (onChangeChar) onChangeChar();
	};
	const onClickEditCell = (lvl: number, multiclass?: string) => {
		setClickedLine(lvl);
		setChosenMulticlass(multiclass);
		setOpenCellsPopup(true);
	};
	const onClickChooseMulticlassCell = (el: {src: string; title: string}) => {
		if (chosenClass === el) {
			setChosenClass(undefined);
			return;
		}
	
		setChosenClass(el);
		
		const newAssociativeCells = associativeCharCells 
			? {...associativeCharCells}
			: {} as associativeCells;
	
		if (!newAssociativeCells[el.src]) {
			newAssociativeCells[el.src] = { cells: [] }; // Инициализируем как массив
		}
		
		// Гарантируем, что cells - массив
		const newCells = [...(newAssociativeCells[el.src].cells || [])];
		while (newCells.length <= clickedLine) {
			newCells.push({count: 0, availible: 0});
		}
		newCells[clickedLine] = {count: 1, availible: 1};
		
		newAssociativeCells[el.src] = {
			...newAssociativeCells[el.src],
			cells: newCells
		};
	
		setAssociativeCharCells(newAssociativeCells);
	};

	const getShadowCells = (count: number) => {
		const result = [];
		for (let index = 0; index < count; index++) {
			result.push(<img src='/cell.svg' key={count+' '+index} className={cn(styles['cell'], styles['cell-shadow'])}/>);
		}
		return result;
	};

	const onClickAddExtraCells = (availible: number) => {
		if (!chosenClass || !associativeCharCells || availible === 0) return;
		if (!Array.isArray(associativeCharCells[chosenClass.src]?.cells)) return;

		// Глубокая копия с обновлением нужного уровня ячеек
		const newCells = [...associativeCharCells[chosenClass.src].cells];
		newCells[clickedLine] = { count: availible, availible };

		const newAssociativeCells = {
			...associativeCharCells,
			[chosenClass.src]: {
				...associativeCharCells[chosenClass.src],
				cells: newCells
			}
		};

		setAssociativeCharCells(newAssociativeCells);
		onClickChangeExtraCells(newAssociativeCells);
	};
	const getExtraCells = (src: string) => {
		if (!associativeCharCells?.[chosenClass?.src ?? '']?.cells?.[clickedLine]) {
			return null;
		}
		const cellLine = associativeCharCells[chosenClass!.src].cells[clickedLine];
		return Array(cellLine.count).fill(0).map((_, i) => (
			<img src={`/${src}`} key={`${src}-${i}`} className={styles['cell']}/>
		));
	};

	const fillSpellParamsToPopup = (level?: number, spell?: Spell) => {
		setChosenSpellLvl(level);
		setChosenSpell(spell);
		setOpenSpellPopup(true);
	};

	return <>
		{getCellsSticker(player, onClickAvailibleExtraCell, onClickCell, onClickEditCell)}
		{isOpenSpellPopup && 
			<EditSpellPopup 
				character={player} 
				setIsOpen={setOpenSpellPopup} 
				spell={chosenSpell}
				chosenLevel={chosenSpellLvl}
				onChangeChar={onChangeChar}>
			</EditSpellPopup>
		}
		{isOpenCellsPopup && 
			<EditCustomPopup header={`Изменить ячейки ${clickedLine+1} уровня`} wrapperCN={styles['spell-popup']} onCancel={onCancelChangeExtraCells} color='spells-blue'>
				<div className={cn(styles['cell-line'], styles['metal-shading'])}>
					<div className={cn(styles['edit-cells-label'])}>
						Изменить количество ячеек
					</div>
					{chosenMulticlass && associativeCharCells && associativeCharCells[chosenMulticlass]?.cells &&
						<div className={cn(styles['edit-cells-cells'])}>
							{associativeCharCells[chosenMulticlass].cells[clickedLine]?.count > 0 && 
								<img src='/cell-remove.svg'
									alt='cell' 
									key={'cell-remove'}
									className={styles['cell']}
									onClick={() => {
										onClickAddCell(clickedLine, associativeCharCells[chosenMulticlass].cells[clickedLine].count-1, true);
									}}
								/>}
							{getCellLine(associativeCharCells[chosenMulticlass].cells[clickedLine],clickedLine,true, undefined,undefined,undefined,undefined,chosenMulticlass?'/'+chosenMulticlass:undefined)}
					
							{associativeCharCells[chosenMulticlass].cells[clickedLine].count && getShadowCells(9-associativeCharCells[chosenMulticlass].cells[clickedLine].count)}
							{associativeCharCells[chosenMulticlass].cells[clickedLine].count &&
								<img src='/cell-add.svg'
									alt='cell' 
									key={'cell-add'}
									className={cn(styles['cell'], styles['cell-add'])}
									onClick={() => {
										onClickAddCell(clickedLine, associativeCharCells[chosenMulticlass].cells[clickedLine].count+1, true);
									}}
								/>}
						</div>
					}
					{!chosenMulticlass && 
						<div className={cn(styles['edit-cells-cells'])}>
							{player.spells.cells[clickedLine].count > 0 &&
								<img src='/cell-remove.svg'
									alt='cell' 
									key={'cell-remove'}
									className={styles['cell']}
									onClick={() => {
										onClickAddCell(clickedLine, player.spells.cells[clickedLine].count-1, true);
									}}
								/>}
							{getCellLine(player.spells.cells[clickedLine],clickedLine,true, undefined,undefined,undefined,undefined,chosenMulticlass?'/'+chosenMulticlass:undefined)}
					
							{player.spells.cells[clickedLine].count < 9 && getShadowCells(9-player.spells.cells[clickedLine].count)}
							{player.spells.cells[clickedLine].count < 9 &&
								<img src='/cell-add.svg'
									alt='cell' 
									key={'cell-add'}
									className={cn(styles['cell'], styles['cell-add'])}
									onClick={() => {
										onClickAddCell(clickedLine, player.spells.cells[clickedLine].count+1, true);
									}}
								/>}
						</div>
					}						
				</div>
				{!chosenMulticlass &&
				<div className={cn(styles['cell-line'], styles['metal-shading'])}>
					<div className={cn(styles['edit-cells-label'])}>
						Добавить ячейки другого класса (выбери цвет)
					</div>
					<div className={cn(styles['edit-cells-colors'])}>
						{cellsColorObj.map((el, index)=>{
							if (player.spells.extraCells && player.spells.extraCells[el.src] && player.spells.extraCells[el.src].cells[clickedLine]) {
								return <img src='/cell-empty2.svg' key={el.src+index} className={cn(styles['cell'],styles['cell-class'])}/>;
							}
							return <img 
								src={'/'+el.src} 
								key={el.title}
								title={el.title} 
								onClick={()=> onClickChooseMulticlassCell(el)} 
								className={cn(styles['cell'], styles['cell-class'], chosenClass === el ? styles['chosen'] : '')}
							/>;})}
					</div>
				</div>}
				{chosenMulticlass && <div className={cn(styles['cell-line'], styles['metal-shading'])}>
					<SquareButton classNames={styles['remove-cell-line-button']} isBigShadow={false}>
						<div className={cn(styles['remove-cell-line-label'])} onClick={onClickRemoveMulticlassCellLine}>
							Удалить этот тип ячеек {clickedLine+1} уровня
						</div>
					</SquareButton>
				</div>}
				{chosenClass &&
				<div className={cn(styles['cell-line'], styles['metal-shading'])}>
					<div className={cn(styles['edit-cells-label'])}>
						Количество новых ячеек
					</div>
					{(associativeCharCells && chosenClass && associativeCharCells[chosenClass.src] && associativeCharCells[chosenClass.src].cells[clickedLine]) &&
					<div className={cn(styles['edit-cells-cells'])}>
						{associativeCharCells[chosenClass.src].cells[clickedLine].count > 0 &&
						<img src='/cell-remove.svg'
							alt='cell' 
							key={'cell-remove-extra'}
							className={styles['cell']}
							onClick={() => {onClickAddExtraCells(associativeCharCells[chosenClass.src].cells[clickedLine].count - 1);}}
						/>}
						{getExtraCells(chosenClass.src)}
						{associativeCharCells[chosenClass.src].cells[clickedLine].count < 9 &&
						<img src='/cell-add.svg'
							alt='cell' 
							key={'cell-add-extra'}
							className={styles['cell']}
							onClick={() => {onClickAddExtraCells(associativeCharCells[chosenClass.src].cells[clickedLine].count + 1);}}
						/>}
					</div>}
				</div>}
			</EditCustomPopup>}
		<div className={styles['scrollable']}>
			{getSpellInfoSticker(
				player.spells.spellsStat, 
				playerStats, 
				onChangeSpellStat, 
				player.spells.saveRoll, 
				onSaveSaveRoll, 
				player.spells.modifier, 
				onSaveSpellModifier)}
			{(freeSpells.length !== 0 && setDiceRoll) && 
				getSpellsSticker(
					freeSpells, {count: 0, availible: 0}, 
					0, 
					'sticker-spell-0', 
					setDiceRoll, 
					playerSpells.modifier, 
					undefined, 
					fillSpellParamsToPopup
				)}
			{player.spells.cells.map((cellLevel, index) => {
				const paidSpells = getSpellsOfLevel(playerSpells.spells, index+1);
				return paidSpells.length !== 0 && setDiceRoll ? 
					getSpellsSticker(
						paidSpells, 
						cellLevel, 
						index+1, 
						`sticker-spell-${index+1}`, 
						setDiceRoll, 
						0, 
						onClickCell,
						fillSpellParamsToPopup
					) : '';
			})}
			<button className={cn(styles['add-spell-sticker'], styles['metal-shading'])} onClick={()=>fillSpellParamsToPopup()}>
				Добавить заклинание другого уровня
			</button>
		</div>
	</>;
}