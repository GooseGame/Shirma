import { Header } from '../../components/Header/Header';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import styles from './Characters.module.css';
import { loadState } from '../../store/storage';
import { useNavigate } from 'react-router-dom';
import { CHAR_KEY, charActions, CharState, deleteChar, load, timestamp } from '../../store/slices/Characters.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import { Character } from '../../interfaces/Character.interface';
import { randomHash } from '../../helpers/random';
import cn from 'classnames';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { ToastNotifications } from '../../components/ToastNotifications/ToastNotifications';

export function Characters() {

	const navigate = useNavigate();
	const [characters, setCharacters] = useState(loadState<CharState>(CHAR_KEY));
	const dispatch = useDispatch<AppDispatch>();
	const needToUpdate = useSelector((s: RootState) => s.characters.needToUpdate);
	const lastUpdatedTimestamp = useSelector((s: RootState) => s.characters.lastUpdateTimestamp);
	const [isLoading, setIsLoading] = useState(false);
	const [unsavedCharacters, setUnsavedCharacters] = useState<string[]>();
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const loadCharsToastRef = useRef(null);

	const handleCreateNewButton = () => {
		if (!unsavedCharacters) {
			navigate('/character/new');
		} else {
			alert('У вас');
		}
	};

	useEffect(()=>{
		if (!characters || characters.characters.length === 0) {
			setIsLoading(true);
			dispatch(load()).then(() => {
				setIsLoading(false);
				setCharacters(loadState<CharState>(CHAR_KEY));
			});
		} else {
			dispatch(timestamp());
		}
	}, []);

	const getCharacters = () => {
		return characters !== undefined ? characters.characters : [];
	};

	const handleDeleteAction = (charId: string) => {
		if (!accessToken) {
			return;
		}
		dispatch(deleteChar({charId, accessToken})).then(()=>{
			if (unsavedCharacters && unsavedCharacters.find((unsavedId) => unsavedId === charId)) {
				unsavedCharacters.filter(unsavedId => unsavedId !== charId);
			}
			setCharacters(loadState<CharState>(CHAR_KEY));
		});		
	};

	const handleCloneAction = (char: Character) => {
		const newCharId = randomHash();
		dispatch(charActions.add({...char, id: newCharId}));
		if (unsavedCharacters && unsavedCharacters.find((unsavedId) => unsavedId === char.id)) {
			setUnsavedCharacters([...unsavedCharacters, newCharId]);
		}
		setCharacters(loadState<CharState>(CHAR_KEY));
	};

	return <RequireAuth>
		<Header />
		<ToastNotifications/>
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