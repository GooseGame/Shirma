import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import { Eye } from '../../components/Eye/Eye';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { getKeywordById, keywords } from '../../helpers/attributes';
import { createCharacter } from '../../helpers/createCharacter';
import { randomHash } from '../../helpers/random';
import { Character, Keyword } from '../../interfaces/Character.interface';
import { AppDispatch, RootState } from '../../store/store';
import { charActions } from '../../store/slices/Characters.slice';
import { loadIfNeeded as loadPresetsIfNeeded } from '../../store/slices/Presets.slice';
import chStyles from '../Characters/Characters.module.css';
import styles from '../Presets/Presets.module.css';
import { RequireAdmin } from '../../components/RequireAdmin/RequireAdmin';

export function AdminPresets() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const presets = useSelector((s: RootState) => s.presets.presets);
	const [kwClicked, setKWClicked] = useState<Keyword[]>([]);

	useEffect(() => {
		dispatch(loadPresetsIfNeeded());
	}, [dispatch]);

	const isKWClicked = (kw: Keyword) => kwClicked.some((el) => el.id === kw.id);

	const onClickKW = (kw: Keyword) => {
		if (!isKWClicked(kw)) {
			setKWClicked([...kwClicked, kw]);
			return;
		}
		setKWClicked(kwClicked.filter((el) => el.id !== kw.id));
	};

	const filteredPresets = useMemo(() => {
		return presets.filter((preset) => {
			const presetKeywordIds = preset.keywordIds ?? [];
			return kwClicked.every((kw) => presetKeywordIds.includes(kw.id));
		});
	}, [presets, kwClicked]);

	const handleCreateNewButton = () => {
		const presetId = randomHash();
		const character = { ...createCharacter(), id: presetId, isPresetDraft: true };
		dispatch(charActions.add(character));
		navigate(`/preset/${presetId}`, { state: { keywordIds: kwClicked.map((kw) => kw.id) } });
	};

	const onClickPreset = (char: Character) => {
		dispatch(charActions.add({ ...char, isPresetDraft: true }));
	};

	return <RequireAdmin>
		<Header />
		<div className={styles['head-area']}>
			<h1 className={styles['header']}>Пресеты</h1>
			<div className={styles['keywords-wrap']}>
				<div className={styles['keywords']}>
					{keywords.map((kw) =>
						<div
							className={cn(styles['keyword'], isKWClicked(kw) ? styles['clicked'] : '')}
							onClick={() => onClickKW(kw)} key={kw.id} title={kw.hint}>
							{kw.name}
						</div>
					)}
				</div>
			</div>
		</div>
		<div className={cn(chStyles['content'], chStyles['scrollable'], styles['content-new'])}>
			<div className={styles['new-char-wrapper']} onClick={handleCreateNewButton}>
				<div className={chStyles['new-char-text']}>
					Новый пустой пресет
				</div>
			</div>
			{filteredPresets.map((preset) => {
				const charFromPreset = { ...preset.character, id: preset.presetId, isPresetDraft: true };
				return <div className={styles['card-wrap']} key={preset.presetId}>
					<MiniCard
						creature={charFromPreset}
						onClickAction={onClickPreset}
						navigatePathBase='/preset'
					/>
					<div className={styles['bottom-card-info']}>
						{(preset.keywordIds ?? []).map((el) => {
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
						{preset.shortDesc && (
							<Eye
								offsetHint={30}
								key={`${preset.presetId}-short-desc`}
								text={preset.shortDesc}
								ElementIstead={
									<div className={cn(styles['keyword'], styles['clicked'], styles['kw-card'], styles['meta-kw'])}>
										Описание
									</div>
								}
							/>
						)}
						{preset.bestFor && (
							<Eye
								offsetHint={30}
								key={`${preset.presetId}-best-for`}
								text={preset.bestFor}
								ElementIstead={
									<div className={cn(styles['keyword'], styles['clicked'], styles['kw-card'], styles['meta-kw'])}>
										Кому подходит
									</div>
								}
							/>
						)}
					</div>
				</div>;
			})}
		</div>
		<MenuMobile />
		<BanSmallScreens />
	</RequireAdmin>;
}
