import { Header } from '../../components/Header/Header';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import styles from './Characters.module.css';
import { loadState } from '../../store/storage';
import { useNavigate } from 'react-router-dom';
import { CHAR_KEY, charActions, CharState, deleteChar, load, save, timestamp } from '../../store/slices/Characters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { Character, CharacterServerTimestamp } from '../../interfaces/Character.interface';
import type { MiniCardSyncSave } from '../../components/MiniCard/MiniCard.props';
import { randomHash } from '../../helpers/random';
import cn from 'classnames';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { pendingToastCall } from '../../components/ToastNotificationItem/PendingToast/PendingToastCall';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';
import { toUnixMillis } from '../../helpers/toUnixMillis';

function staleCharacterIdsFromServerTimestamps(
	serverEntries: CharacterServerTimestamp[],
	localCharacters: Character[]
): string[] {
	const staleIds: string[] = [];
	for (const { charId, lastUpdatedTimestamp: serverTsRaw } of serverEntries) {
		const serverTs = toUnixMillis(serverTsRaw);
		const local = localCharacters.find(c => c.id === charId);
		const localTs = local?.lastUpdatedTimestamp;
		if (!local || localTs === undefined || localTs < serverTs) {
			staleIds.push(charId);
		}
	}
	return staleIds;
}

function getPendingServerSync(
	char: Character,
	serverTsByCharId: Record<string, number> | null
): MiniCardSyncSave | null {
	if (serverTsByCharId === null) {
		return null;
	}
	const serverTsRaw = serverTsByCharId[char.id];
	if (serverTsRaw === undefined) {
		return { kind: 'notOnServer' };
	}
	const serverTs = toUnixMillis(serverTsRaw);
	const localTs = char.lastUpdatedTimestamp ? Math.floor(char.lastUpdatedTimestamp / 1000) * 1000 : undefined;
	if (localTs !== undefined && localTs > serverTs) {
		return { kind: 'newerThanServer', serverSavedAt: serverTs };
	}
	return null;
}

export function Characters() {

	const navigate = useNavigate();
	const [characters, setCharacters] = useState(loadState<CharState>(CHAR_KEY));
	const dispatch = useDispatch<AppDispatch>();
	const [unsavedCharacters, setUnsavedCharacters] = useState<string[]>();
	const [serverTsByCharId, setServerTsByCharId] = useState<Record<string, number> | null>(null);
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);

	const handleCreateNewButton = () => {
		if (!unsavedCharacters) {
			navigate('/character/new');
		} else {
			alert('У вас');
		}
	};

	useEffect(() => {
		const snapshot = loadState<CharState>(CHAR_KEY);
		const localList = snapshot?.characters ?? [];

		const tsPromise = dispatch(timestamp()).unwrap();
		pendingToastCall({
			pendingPromise: tsPromise,
			headerPending: 'Проверка обновлений...',
			headerSuccess: 'Готово',
			headerError: 'Ошибка',
			textSuccess: 'Время последнего обновления на сервере получено.',
			textError: 'Не удалось получить время обновления списка персонажей.'
		});

		tsPromise
			.then((serverTimestamps) => {
				setServerTsByCharId(
					Object.fromEntries(
						serverTimestamps.map((e) => [e.charId, toUnixMillis(e.lastUpdatedTimestamp)])
					)
				);
				const staleIds = staleCharacterIdsFromServerTimestamps(serverTimestamps, localList);
				if (staleIds.length === 0) {
					return;
				}
				const loadPromise = dispatch(load({ charIds: staleIds })).unwrap();
				pendingToastCall({
					pendingPromise: loadPromise,
					headerPending: 'Загрузка персонажей...',
					headerSuccess: 'Готово',
					headerError: 'Ошибка',
					textSuccess: 'Персонажи загружены с сервера.',
					textError: 'Не удалось загрузить персонажей с сервера.'
				});
				return loadPromise;
			})
			.finally(() => {
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
	}, [dispatch]);

	const getCharacters = () => {
		const list = characters !== undefined ? characters.characters : [];
		return [...list].sort((a, b) => {
			const tb = b.lastUpdatedTimestamp ?? 0;
			const ta = a.lastUpdatedTimestamp ?? 0;
			return tb - ta;
		});
	};

	const handleDeleteAction = (charId: string) => {
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы удалять персонажей.' });
			return;
		}
		const deletePromise = dispatch(deleteChar({ charId, accessToken }))
			.unwrap()
			.then(() => {
				setUnsavedCharacters((prev) => prev?.filter((unsavedId) => unsavedId !== charId));
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
		pendingToastCall({
			pendingPromise: deletePromise,
			headerPending: 'Удаление...',
			headerSuccess: 'Удалено',
			headerError: 'Ошибка',
			textSuccess: 'Персонаж удалён.',
			textError: 'Не удалось удалить персонажа.'
		});
	};

	const handleCloneAction = (char: Character) => {
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы клонировать персонажей.' });
			return;
		}
		const newCharId = randomHash();
		const clonePromise = dispatch(
			save({ character: { ...char, id: newCharId }, accessToken, timestamp: Date.now() })
		)
			.unwrap()
			.then(() => {
				dispatch(charActions.add({ ...char, id: newCharId }));
				if (unsavedCharacters?.includes(char.id)) {
					setUnsavedCharacters((prev) => [...(prev ?? []), newCharId]);
				}
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
		pendingToastCall({
			pendingPromise: clonePromise,
			headerPending: 'Клонирование...',
			headerSuccess: 'Сохранено',
			headerError: 'Ошибка',
			textSuccess: 'Клон персонажа сохранён на сервере.',
			textError: 'Не удалось сохранить клон персонажа.'
		});
	};

	const handleSyncSave = (char: Character) => {
		if (!accessToken) {
			errorToastCall({ header: 'Ошибка', text: 'Нужно войти в аккаунт, чтобы сохранять персонажей.' });
			return;
		}
		const ts = Date.now();
		const savePromise = dispatch(save({ character: char, accessToken, timestamp: ts }))
			.unwrap()
			.then(() => {
				setServerTsByCharId((prev) => (prev ? { ...prev, [char.id]: ts } : prev));
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
		pendingToastCall({
			pendingPromise: savePromise,
			headerPending: 'Сохранение...',
			headerSuccess: 'Сохранено',
			headerError: 'Ошибка',
			textSuccess: 'Персонаж сохранён на сервере.',
			textError: 'Не удалось сохранить персонажа.'
		});
	};

	return <RequireAuth>
		<Header />
		<NotificationCenter />
		<div className={cn(styles['content'], styles['scrollable'])}>
			{getCharacters().map((character) => {
				const syncSave = getPendingServerSync(character, serverTsByCharId);
				return (
					<MiniCard
						key={character.id}
						creature={character}
						deleteAction={handleDeleteAction}
						cloneAction={handleCloneAction}
						syncSave={syncSave}
						onSyncSave={handleSyncSave}
					/>
				);
			})}
			<div className={styles['new-char-wrapper']} onClick={handleCreateNewButton}>
				<div className={styles['new-char-text']}>
					Новый персонаж
				</div>
			</div>
		</div>
		<MenuMobile/>
		<BanSmallScreens/>
	</RequireAuth>;
}