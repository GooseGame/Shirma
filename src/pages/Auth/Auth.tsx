import { useEffect, useRef, useState } from 'react';
import styles from './Auth.module.css';
import { DiceFall } from '../../components/DicesFall/DicesFall';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { login, profile, userActions } from '../../store/slices/User.slice';
import { AppDispatch, RootState } from '../../store/store';
import { PopupProps } from '../../components/Popup/Popup.props';
import { NotificationCenter } from '../../components/NotificationCenter/NotificationCenter';
import { randomHash } from '../../helpers/random';
import { useNavigate } from 'react-router-dom';

export function Auth() {
	const dispatch = useDispatch<AppDispatch>();
	const [popups, setPopups] = useState<PopupProps[]>([]);
	const navigate = useNavigate();
	const isNew = useSelector((s: RootState) => s.user.users.isNew);
	const loginErrMSG = useSelector((s: RootState) => s.user.users.loginErrorMessage);
	const [isLoading, setIsLoading] = useState(false);
	const [loginLoaded, setLoginLoaded] = useState(false);

	useEffect(()=>{if (loginLoaded) { 
		dispatch(userActions.clearErrors());
		dispatch(profile()).then(()=>navigate('/characters'));
		navigate('/characters');
	}}, [loginLoaded, navigate, dispatch]);

	useEffect(()=>{if (isNew) { 
		dispatch(userActions.clearErrors());
		navigate('/name');
	}}, [dispatch, isNew, navigate]);

	useEffect(()=>{
		if (loginErrMSG !== undefined) {
			setIsLoading(false);
			addPopup({
				popupid: randomHash(),
				header: 'Что-то пошло не так',
				text: loginErrMSG,
				isShow: true
			});
			console.log(loginErrMSG);
		}}, [loginErrMSG]);

	const addPopup = (popup: PopupProps) => {
		setPopups([...popups, popup]);
	};
	const removePopup = (id: string) => {
		setPopups(popups.filter(el => el.popupid !== id));
	};
	const clearPopups = () => {
		setPopups([]);
		dispatch(userActions.clearErrors());
	};
	
	const onSuccessGoogleCallback = (credentialResponse: CredentialResponse) => {
		console.log(credentialResponse);
		if (!credentialResponse.credential) {
			throw new Error('No credentials in google?');
		}
		try {
			dispatch(userActions.clearErrors());
			dispatch(login({googleToken: credentialResponse.credential})).then(()=>{setLoginLoaded(true);});
			setIsLoading(true);
		} catch (e) {
			console.log(e);
			addPopup({
				popupid: randomHash(),
				header: 'Что-то пошло не так',
				text: 'Попробуй снова',
				isShow: true
			});		
		}
	};
	const containerRef = useRef<HTMLDivElement>(null);
	return <div className={styles['container']}>
		<NotificationCenter popups={popups} remove={removePopup} clear={clearPopups}/>
		<div className={styles['content']} ref={containerRef}>
			<div className={styles['info']}>
				<h1 className={styles['shirma']}>Ширма</h1>
				<h3 className={styles['about']}>Ширма -это приложение-компаньон для DND 5 редакции.</h3>
				<div className={styles['login-container']}>
					<h3 className={styles['who']}>А кто ты?</h3>
					{!isLoading &&
						<GoogleLogin
							theme="filled_black"
							size='large'
							shape='rectangular'
							onSuccess={credentialResponse => {
								onSuccessGoogleCallback(credentialResponse);
							}}
							onError={() => {
								console.log('Login Failed');
							}}
						/>
					}
					{isLoading && <img src='/loader-bigger.gif' alt='loading...' className={styles['loading']}/>}
				</div>
			</div>
			<DiceFall containerRef={containerRef} countOfDices={15}/>
		</div>
	</div>;
}