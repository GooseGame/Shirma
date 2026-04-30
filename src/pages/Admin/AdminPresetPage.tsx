import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Damage, DiceCheck } from '../../interfaces/Equipment.interface';
import { Header } from '../../components/Header/Header';
import { CharacterCard } from '../../layouts/CharacterCard/CharacterCard';
import { AppDispatch, RootState } from '../../store/store';
import { createCharacter } from '../../helpers/createCharacter';
import { charActions } from '../../store/slices/Characters.slice';
import { deletePreset, save, presetAction } from '../../store/slices/Presets.slice';
import { RequireAdmin } from '../../components/RequireAdmin/RequireAdmin';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { pendingToastCall } from '../../components/ToastNotificationItem/PendingToast/PendingToastCall';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';
import { RollBox } from '../../components/RollBox/RollBox';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { PresetCharacter } from '../../interfaces/Character.interface';
import { keywords } from '../../helpers/attributes';
import styles from './AdminPresetPage.module.css';
import cn from 'classnames';

export function AdminPresetPage() {
	const navigate = useNavigate();
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const allPresets = useSelector((s: RootState) => s.presets.presets);
	const characters = useSelector((s: RootState) => s.characters.characters);
	const [rollBoxProps, setRollboxProps] = useState<Damage[] | DiceCheck[]>([]);
	const [activeSegment, setActiveSegment] = useState<'card' | 'settings'>('card');
	const [shortDesc, setShortDesc] = useState('');
	const [bestFor, setBestFor] = useState('');
	const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([]);

	const localCharacter = id ? characters.find((ch) => ch.id === id) : undefined;
	const preset = useMemo(() => allPresets.find((p) => p.presetId === id), [allPresets, id]);
	const character = localCharacter ?? (preset ? { ...preset.character, id: preset.presetId, isPresetDraft: true } : undefined);

	const keywordIdsFromState = (location.state as { keywordIds?: number[] } | null)?.keywordIds;

	useEffect(() => {
		if (!id) {
			navigate('/presets');
			return;
		}
		if (!character) {
			const fallback = { ...createCharacter(), id, isPresetDraft: true };
			dispatch(charActions.add(fallback));
			return;
		}
		dispatch(charActions.add({ ...character, isPresetDraft: true }));
	}, [id, character, dispatch, navigate]);

	useEffect(() => {
		setShortDesc(preset?.shortDesc ?? '');
		setBestFor(preset?.bestFor ?? '');
		setSelectedKeywordIds(keywordIdsFromState ?? preset?.keywordIds ?? []);
	}, [id, preset, keywordIdsFromState]);

	const onToggleKeyword = (keywordId: number) => {
		setSelectedKeywordIds((prev) =>
			prev.includes(keywordId) ? prev.filter((idValue) => idValue !== keywordId) : [...prev, keywordId]
		);
	};

	const onSavePreset = async () => {
		if (!id) {
			return;
		}
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы сохранять пресеты.' });
			return;
		}
		const charToSave = characters.find((ch) => ch.id === id);
		if (!charToSave) {
			errorToastCall({ header: 'Ошибка', text: 'Не удалось найти пресет для сохранения.' });
			return;
		}
		const payload: PresetCharacter = {
			presetId: id,
			character: { ...charToSave, isPresetDraft: undefined },
			shortDesc,
			bestFor,
			keywordIds: selectedKeywordIds
		};
		const pendingPromise = dispatch(save({ character: payload, accessToken, presetId: id })).unwrap();
		pendingToastCall({
			pendingPromise,
			headerPending: 'Сохранение пресета...',
			headerSuccess: 'Сохранено',
			headerError: 'Ошибка',
			textSuccess: 'Пресет сохранён.',
			textError: 'Не удалось сохранить пресет.'
		});
		await pendingPromise;
		dispatch(presetAction.upsertOne(payload));
	};

	const onDeletePreset = async () => {
		if (!id) {
			return;
		}
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы удалять пресеты.' });
			return;
		}
		const pendingPromise = dispatch(deletePreset({ presetId: id, accessToken })).unwrap();
		pendingToastCall({
			pendingPromise,
			headerPending: 'Удаление пресета...',
			headerSuccess: 'Удалено',
			headerError: 'Ошибка',
			textSuccess: 'Пресет удалён.',
			textError: 'Не удалось удалить пресет.'
		});
		await pendingPromise;
		dispatch(presetAction.removeOne(id));
		dispatch(charActions.remove(id));
		navigate('/presets');
	};

	const presetSegmentTabs = (
		<div className={cn(styles['segment-tabs'], activeSegment === 'settings' ? styles['segment-tabs-settings'] : '')}>
			<button
				className={cn(styles['segment-tab'], activeSegment === 'card' ? styles['segment-tab-active'] : '')}
				onClick={() => setActiveSegment('card')}
			>
				Карточка
			</button>
			<button
				className={cn(styles['segment-tab'], activeSegment === 'settings' ? styles['segment-tab-active'] : '')}
				onClick={() => setActiveSegment('settings')}
				title='Настройки пресета'
			>
				<img
					src={activeSegment === 'settings' ? '/settings.svg' : '/settings-gray.svg'}
					alt='preset settings'
					className={styles['settings-icon']}
				/>
				<span className={styles['segment-tab-text']}>Настройки пресета</span>
			</button>
		</div>
	);

	return <RequireAdmin>
		<Header mainLinkLabel='Пресеты' mainLinkPath='/presets' />
		<div className={styles['container']}>
			<NotificationCenter />
			{character && activeSegment === 'card' && <CharacterCard
				character={character}
				setDiceRoll={setRollboxProps}
				onSaveCharacter={onSavePreset}
				onDeleteCharacter={onDeletePreset}
				saveButtonLabel='Сохранить пресет'
				actionsBottomContent={presetSegmentTabs}
			/>}
			{activeSegment === 'settings' && (
				<>
					{presetSegmentTabs}
					<div className={styles['preset-settings']}>
						<div className={styles['field-wrap']}>
							<label className={styles['field-label']} htmlFor='preset-short-desc'>shortDesc</label>
							<textarea
								id='preset-short-desc'
								className={styles['field-input']}
								value={shortDesc}
								onChange={(e) => setShortDesc(e.target.value)}
								rows={3}
								placeholder='Короткое описание пресета'
							/>
						</div>
						<div className={styles['field-wrap']}>
							<label className={styles['field-label']} htmlFor='preset-best-for'>bestFor</label>
							<textarea
								id='preset-best-for'
								className={styles['field-input']}
								value={bestFor}
								onChange={(e) => setBestFor(e.target.value)}
								rows={3}
								placeholder='Кому подходит этот пресет'
							/>
						</div>
						<div className={styles['field-wrap']}>
							<div className={styles['field-label']}>Кейворды</div>
							<div className={styles['keywords-wrap']}>
								{keywords.map((keyword) => (
									<button
										key={keyword.id}
										className={`${styles['keyword-btn']} ${selectedKeywordIds.includes(keyword.id) ? styles['keyword-btn-active'] : ''}`}
										onClick={() => onToggleKeyword(keyword.id)}
										title={keyword.hint}
									>
										{keyword.name}
									</button>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
		<MenuMobile />
		<RollBox dicesSent={rollBoxProps} />
		<BanSmallScreens />
	</RequireAdmin>;
}
