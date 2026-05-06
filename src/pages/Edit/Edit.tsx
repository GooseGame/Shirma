import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { name, profile, userActions } from '../../store/slices/User.slice';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';
import { pendingToastCall } from '../../components/ToastNotificationItem/PendingToast/PendingToastCall';
import styles from './Edit.module.css';

export function Edit() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const oldName = useSelector((s: RootState) => s.user.users.name);
	const email = useSelector((s: RootState) => s.user.users.email);
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const role = useSelector((s: RootState) => s.user.users.role);
	const profileErr = useSelector((s: RootState) => s.user.users.profileErrorMessage);
	const [newName, setNewName] = useState(oldName);

	useEffect(() => {
		dispatch(profile());
	}, [dispatch]);

	useEffect(() => {
		setNewName(oldName);
	}, [oldName]);

	useEffect(() => {
		if (profileErr !== undefined) {
			errorToastCall({ header: 'Что-то пошло не так', text: profileErr });
			dispatch(userActions.clearErrors());
		}
	}, [dispatch, profileErr]);

	const onSaveName = () => {
		if (!accessToken || newName.trim().length < 3) return;
		pendingToastCall({
			pendingPromise: dispatch(name({ name: newName.trim(), accessToken })).unwrap(),
			headerPending: 'Сохраняем никнейм...',
			headerSuccess: 'Никнейм обновлен',
			textSuccess: 'Изменения успешно сохранены',
			headerError: 'Что-то пошло не так',
			textError: 'Не удалось сохранить никнейм'
		});
	};

	const onLogout = () => {
		dispatch(userActions.logout());
		navigate('/auth');
	};

	return (
		<RequireAuth>
			<div className={styles['page']}>
				<NotificationCenter />
				<div className={styles['card']}>
					<h1 className={styles['title']}>Редактирование профиля</h1>
					<div className={styles['field-group']}>
						<label className={styles['label']} htmlFor='nickname'>Никнейм</label>
						<div className={styles['line']}>
							<input
								id='nickname'
								type='text'
								value={newName}
								className={styles['input']}
								onChange={(e) => setNewName(e.target.value.slice(0, 32))}
							/>
							<button
								type='button'
								className={styles['save-btn']}
								onClick={onSaveName}
								disabled={newName.trim().length < 3}
							>
								Сохранить
							</button>
						</div>
					</div>
					<div className={styles['field-group']}>
						<p className={styles['label']}>Почта</p>
						<p className={styles['email']}>{email}</p>
					</div>
					{role == 1 && (
						<div className={styles['field-group']}>
							<p className={styles['label']}>Админ-панель</p>
							<Link to='/admin' className={styles['admin-link']}>
								Админка
							</Link>
						</div>
					)}
					<div className={styles['actions']}>
						<button type='button' className={styles['logout-btn']} onClick={onLogout}>
							Выйти из аккаунта
						</button>
						<button type='button' className={styles['back-btn']} onClick={() => navigate(-1)}>
							Назад
						</button>
					</div>
				</div>
			</div>
		</RequireAuth>
	);
}
