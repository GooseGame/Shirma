import { Header } from '../../components/Header/Header';
import { MiniCard } from '../../components/MiniCard/MiniCard';
import styles from './Characters.module.css';
import { loadState } from '../../store/storage';
import { useNavigate } from 'react-router-dom';
import { CHAR_KEY, charActions, CharState } from '../../store/slices/Characters.slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { useState } from 'react';
import { Character } from '../../interfaces/Character.interface';
import { randomHash } from '../../helpers/random';
import cn from 'classnames';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';

export function Characters() {

	const navigate = useNavigate();
	const [characters, setCharacters] = useState(loadState<CharState>(CHAR_KEY));
	const dispatch = useDispatch<AppDispatch>();

	const handleCreateNewButton = () => {
		navigate('/character/new');
	};

	const getCharacters = () => {
		return characters !== undefined ? characters.characters : [];
	};

	const handleDeleteAction = (id: string) => {
		dispatch(charActions.remove(id));
		setCharacters(loadState<CharState>(CHAR_KEY));
	};

	const handleCloneAction = (char: Character) => {
		dispatch(charActions.add({...char, id: randomHash()}));
		setCharacters(loadState<CharState>(CHAR_KEY));
	};

	return <>
		<Header />
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
	</>;
}