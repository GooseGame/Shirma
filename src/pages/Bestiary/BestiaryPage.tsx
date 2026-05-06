import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { AppDispatch, RootState } from '../../store/store';
import { deleteMonster, getMonsterById, monstersActions, saveMonster } from '../../store/slices/Monsters.slice';
import { Monster, MonsterSimplyfied } from '../../interfaces/Monster.interface';
import styles from './BestiaryPage.module.css';
import { createMonster } from '../../helpers/createMonster';

function makePreview(monster: Monster): MonsterSimplyfied {
	return {
		id: monster.id,
		name: monster.name,
		avatar: monster.avatar,
		challengeRating: monster.danger.challengeRating,
		typeName: monster.type.name,
		livingAreas: [monster.livingAreas.map((area) => area.land).join(', ')],
		sizeNames: [monster.size.map((size) => size.name).join(', ')],
		alignmentShort: monster.alignmentShort
	};
}

export function BestiaryPage() {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const monster = useSelector((s: RootState) => s.monsters.drafts.find((item) => item.id === id));
	const role = useSelector((s: RootState) => s.user.users.role);
	const preview = (location.state as { preview?: MonsterSimplyfied } | null)?.preview;

	useEffect(() => {
		if (!id) {
			navigate('/bestiary');
			return;
		}
		if (!monster) {
			if (preview?.id === id) {
				const draft = createMonster();
				dispatch(monstersActions.upsertDraft({
					...draft,
					id,
					name: preview.name,
					avatar: preview.avatar,
					danger: {
						...draft.danger,
						challengeRating: preview.challengeRating
					}
				}));
			}
			dispatch(getMonsterById({ id }));
		}
	}, [id, monster, navigate, dispatch, preview]);

	if (!id) {
		return null;
	}

	const handleSave = async () => {
		if (!accessToken || !monster) {
			return;
		}
		const preview = makePreview(monster);
		await dispatch(saveMonster({ monster: { ...monster, id }, monster_preview: preview, accessToken })).unwrap();
		navigate('/bestiary');
	};

	const handleDelete = async () => {
		if (!accessToken) {
			return;
		}
		await dispatch(deleteMonster({ id, accessToken })).unwrap();
		navigate('/bestiary');
	};

	const isAdmin = role === 1;

	return <RequireAuth>
		<Header />
		<NotificationCenter />
		<div className={styles['content']}>
			<h2 className={styles['title']}>{isAdmin ? 'Редактор общих монстров' : 'Редактор моих монстров'}</h2>
			<div className={styles['field']}>
				<label htmlFor='monster-name'>Имя</label>
				<input
					id='monster-name'
					value={monster?.name ?? ''}
					onChange={(e) => dispatch(monstersActions.setName({ id, name: e.target.value }))}
				/>
			</div>
			<div className={styles['field']}>
				<label htmlFor='monster-avatar'>Аватар (URL)</label>
				<input
					id='monster-avatar'
					value={monster?.avatar ?? ''}
					onChange={(e) => dispatch(monstersActions.setAvatar({ id, avatar: e.target.value }))}
				/>
			</div>
			<div className={styles['field']}>
				<label htmlFor='monster-cr'>Уровень опасности (CR)</label>
				<input
					id='monster-cr'
					type='number'
					min={0}
					step={0.125}
					value={monster?.danger.challengeRating ?? 0}
					onChange={(e) =>
						dispatch(monstersActions.setChallengeRating({ id, challengeRating: Number(e.target.value) || 0 }))
					}
				/>
			</div>
			<div className={styles['actions']}>
				<button onClick={handleSave} className={styles['save']}>Сохранить</button>
				<button onClick={handleDelete} className={styles['delete']}>Удалить</button>
			</div>
		</div>
		<MenuMobile />
		<BanSmallScreens />
	</RequireAuth>;
}
