import { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { presetAction, PRESETS_KEY, PresetState } from '../../store/slices/Presets.slice';
import { loadState } from '../../store/storage';
import { getAllPresets } from '../../helpers/firebase';
import { Character, Keyword, PresetCharacter } from '../../interfaces/Character.interface';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import { randomHash } from '../../helpers/random';
import { charActions } from '../../store/slices/Characters.slice';
import chStyles from '../Characters/Characters.module.css';
import cn from 'classnames';
import { createCharacter } from '../../helpers/createCharacter';
import { useNavigate } from 'react-router-dom';
import styles from './Presets.module.css';
import { getKeywordById, keywords } from '../../helpers/attributes';
import { Eye } from '../../components/Eye/Eye';

export function Presets() {
	const [presets, setPresets] = useState(loadState<PresetState>(PRESETS_KEY));
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [kwClicked, setKWClicked] = useState<Keyword[]>([]);

	const isKWClicked = (kw: Keyword) => {
		return kwClicked.find(el=>el.id===kw.id) !== undefined;
	};
	
	const isPresetAllowedByKWs = (pr: PresetCharacter) => {
		let isAllowedCount = 0;
		kwClicked.forEach(kw=>{
			if (pr.keywordIds.includes(kw.id)) {
				isAllowedCount++;
			}
		});
		return isAllowedCount === kwClicked.length;
	};

	const onClickKW = (kw: Keyword) => {
		if (!isKWClicked(kw)) {
			setKWClicked([...kwClicked, kw]);
		} else {
			setKWClicked(kwClicked.filter(el => el.id !== kw.id));
		}
	};

	useEffect(() => {
		if (!presets || presets.presets.length === 0) {
			getAllPresets().then((data: PresetCharacter[]) => {
				console.log('Подгрузили пресеты:', data);
				dispatch(presetAction.addAll(data));
				setPresets(loadState<PresetState>(PRESETS_KEY));
			}).catch(e=>console.log(e));
		}
	});

	const getPresets = () => {
		return presets !== undefined ? presets.presets : [];
	};

	const onClickPreset = (char: Character) => {
		dispatch(charActions.add(char));
	};

	const handleCreateNewButton = () => {
		const character = createCharacter();
		dispatch(charActions.add(character));
		navigate('/character/'+character.id);
	};

	return <>
		<Header/>
		<div className={styles['head-area']}>
			<h1 className={styles['header']}>Выбери из пресетов или создай своего</h1>
			<div className={styles['keywords-wrap']}>
				<div className={styles['keywords']}>
					{keywords.map((kw)=>
						<div
							className={cn(styles['keyword'], isKWClicked(kw) ? styles['clicked'] : '')} 
							onClick={()=>onClickKW(kw)} key={kw.id} title={kw.hint}>
							{kw.name}
						</div>
					)}
				</div>
			</div>
		</div>
		<div className={cn(chStyles['content'], chStyles['scrollable'], styles['content-new'])}>
			<div className={cn(styles['new-char-wrapper'])} onClick={handleCreateNewButton}>
				<div className={chStyles['new-char-text']}>
					Новый пустой персонаж
				</div>
			</div>
			{getPresets().map(preset => {
				const charFromPreset = {...preset.character, id: randomHash()};
				return <div className={cn(styles['card-wrap'], isPresetAllowedByKWs(preset) ? '' : styles['hidden'])} key={preset.presetId}>
					<MiniCard 
						creature={charFromPreset} 
						onClickAction={onClickPreset}
					/>
					<div className={styles['bottom-card-info']}>
						{preset.keywordIds.map(el=> {
							const keywordInfo = getKeywordById(el);
							if (!keywordInfo) return <></>;
							return <Eye 
								offsetHint={30}
								key={`${preset.presetId}-${el}`}
								text={keywordInfo.hint} 
								ElementIstead={
									<div className={cn(styles['keyword'], styles['clicked'], styles['kw-card'])}>
										{keywordInfo.name}
									</div>
								}
							/>;
						})}
					</div>
				</div>;}
			)}
		</div>
	</>;
}