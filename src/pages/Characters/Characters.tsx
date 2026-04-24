import { Header } from '../../components/Header/Header';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import styles from './Characters.module.css';
import { loadState } from '../../store/storage';
import { useNavigate } from 'react-router-dom';
import { CHAR_KEY, charActions, CharState, deleteChar, load, save, timestamp } from '../../store/slices/Characters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { Character } from '../../interfaces/Character.interface';
import { randomHash } from '../../helpers/random';
import cn from 'classnames';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { pendingToastCall } from '../../components/ToastNotificationItem/PendingToast/PendingToastCall';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';

export function Characters() {

	const navigate = useNavigate();
	const [characters, setCharacters] = useState(loadState<CharState>(CHAR_KEY));
	const dispatch = useDispatch<AppDispatch>();
	const [unsavedCharacters, setUnsavedCharacters] = useState<string[]>();
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
		const localTs = snapshot?.lastUpdateTimestamp ?? 0;

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
			.then(({ lastUpdated }) => {
				const needsFullLoad =
					localList.length === 0 || lastUpdated > localTs;
				if (needsFullLoad) {
					const loadPromise = dispatch(load()).unwrap();
					pendingToastCall({
						pendingPromise: loadPromise,
						headerPending: 'Загрузка персонажей...',
						headerSuccess: 'Готово',
						headerError: 'Ошибка',
						textSuccess: 'Персонажи загружены с сервера.',
						textError: 'Не удалось загрузить персонажей с сервера.'
					});
					return loadPromise;
				}
			})
			.finally(() => {
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
	}, [dispatch]);

	const getCharacters = () => {
		return characters !== undefined ? characters.characters : [];
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

	return <RequireAuth>
		<Header />
		<NotificationCenter />
		<div className={cn(styles['content'], styles['scrollable'])}>
			{getCharacters().map(character => (
				<MiniCard key={character.id} deleteAction={handleDeleteAction} cloneAction={handleCloneAction} creature={character}/>
			))}
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