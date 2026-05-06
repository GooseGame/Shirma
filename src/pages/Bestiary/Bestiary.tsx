import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { MenuMobile } from '../../components/MenuMobile/MenuMobile';
import { BanSmallScreens } from '../../components/BanSmallScreens/BanSmallScreens';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { AppDispatch, RootState } from '../../store/store';
import { loadMonstersBy, monstersActions } from '../../store/slices/Monsters.slice';
import { createMonster } from '../../helpers/createMonster';
import styles from './Bestiary.module.css';
import { MonsterSimplyfied } from '../../interfaces/Monster.interface';

export function Bestiary() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const localMonsters = useSelector((s: RootState) => s.monsters.localMonsters);
	const globalMonsters = useSelector((s: RootState) => s.monsters.globalMonsters);

	useEffect(() => {
		dispatch(loadMonstersBy({ by: 'local' }));
		dispatch(loadMonstersBy({ by: 'global' }));
		console.log(localMonsters);
		console.log(globalMonsters);
	}, [dispatch]);

	const handleCreate = () => {
		const newMonster = createMonster();
		dispatch(monstersActions.upsertDraft(newMonster));
		navigate(`/bestiary/${newMonster.id}`);
	};

	const handleOpenMonster = (monster: MonsterSimplyfied) => {
		navigate(`/bestiary/${monster.id}`, { state: { preview: monster } });
	};

	return <RequireAuth>
		<Header />
		<NotificationCenter />
		<div className={styles['content']}>
			<div className={styles['section']}>
				<h2 className={styles['section-title']}>Мои монстры</h2>
				<div className={styles['list']}>
					{localMonsters.map((monster) => (
						<button key={monster.id} className={styles['card']} onClick={() => handleOpenMonster(monster)}>
							<img src={monster.avatar} alt={monster.name} className={styles['avatar']} />
							<div className={styles['card-main']}>
								<div className={styles['name']}>{monster.name}</div>
								<div className={styles['meta']}>CR {monster.challengeRating}</div>
							</div>
						</button>
					))}
				</div>
			</div>
			<div className={styles['section']}>
				<h2 className={styles['section-title']}>Общая база</h2>
				<div className={styles['list']}>
					{globalMonsters.map((monster) => (
						<button key={monster.id} className={styles['card']} onClick={() => handleOpenMonster(monster)}>
							<img src={monster.avatar} alt={monster.name} className={styles['avatar']} />
							<div className={styles['card-main']}>
								<div className={styles['name']}>{monster.name}</div>
								<div className={styles['meta']}>CR {monster.challengeRating}</div>
							</div>
						</button>
					))}
				</div>
			</div>
			<button className={styles['create']} onClick={handleCreate}>Создать монстра</button>
		</div>
		<MenuMobile />
		<BanSmallScreens />
	</RequireAuth>;
}
