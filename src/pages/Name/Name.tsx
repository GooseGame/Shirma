import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStyles from './../Auth/Auth.module.css';
import { name, profile, userActions } from '../../store/slices/User.slice';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { defaultToastCall as errorToastCall } from '../../components/ToastNotificationItem/ErrorToast/ErrorToastCall';
import cn from 'classnames';
import { RequireAuth } from '../../components/RequireAuth/RequireAuth';

export function Name() {
	const isNew = useSelector((s: RootState) => s.user.users.isNew);
	const oldName = useSelector((s: RootState) => s.user.users.name);
	const [newName, setNewName] = useState(oldName);
	const profileErr = useSelector((s: RootState) => s.user.users.profileErrorMessage);
	const accessToken = useSelector((s: RootState) => s.user.users.accessToken);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const [buttonClicked, setButtonClicked] = useState(false);

	useEffect(()=>{
		dispatch(profile());
	}, [dispatch]);
	useEffect(()=>{
		setNewName(oldName);
	}, [oldName]);

	useEffect(()=>{
		dispatch(userActions.clearErrors());
		if (!isNew) navigate('/characters');
	}, [dispatch, isNew, navigate]);

	useEffect(()=>{
		if (profileErr !== undefined) {
			errorToastCall({ header: 'Что-то пошло не так', text: profileErr });
			dispatch(userActions.clearErrors());
		}
	}, [profileErr, dispatch]);

	useEffect(()=>{
		if (buttonClicked) {
			setTimeout(()=>{setButtonClicked(false);}, 500);
		}
	}, [buttonClicked]);

	const validateName = (val: string) => {
		if (val.length < 32) {
			setNewName(val);
		}
	};

	const onCancel = async () => {
		if (buttonClicked) return;
		if (!accessToken) return;
		if (isNew) {
			await dispatch(name({name: oldName, accessToken})).unwrap();
			dispatch(userActions.setOld());
			navigate('/characters');
		} else {
			navigate('/characters');
		}
	};

	const onSave = async () => {
		if (buttonClicked) return;
		if (newName.length < 3) return;
		if (!accessToken) return;
		try {
			await dispatch(name({name: newName, accessToken})).unwrap();
			dispatch(userActions.setOld());
			navigate('/characters');
		} catch (error) {
			errorToastCall({ header: 'Что-то пошло не так', text: 'не удалось сохранить никнейм' });
		}
	};

	return <RequireAuth><div className={authStyles['container']}>
		<NotificationCenter />
		<div className={authStyles['content']}>
			<div className={authStyles['info']}>
				<h1 className={authStyles['shirma']}>Твой никнейм</h1>
				<div className={authStyles['login-container']}>
					<h3 className={authStyles['who']}>Как тебя будут видеть остальные.</h3>
					<input 
						type='text' 
						value={newName} 
						className={authStyles['input']} 
						onChange={(e)=>{validateName(e.target.value);}}
					/>
					<div className={authStyles['buttons-line']}>
						<button 
							className={cn(authStyles['btn'], authStyles['cancel-btn'])} 
							onClick={onCancel}>Отмена
						</button>
						<button 
							className={cn(authStyles['btn'], authStyles['save-btn'], newName.length > 3 ? '' : authStyles['disabled'])} 
							onClick={onSave}>
							<img src='/more-white.svg' className={authStyles['save-img']}/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div></RequireAuth>;
}