import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './api/setupAxiosAuth';
import './index.css';
import '../fonts/styles.css';
import { Characters } from './pages/Characters/Characters.tsx';
import { CharacterPage } from './pages/CharacterPage/CharacterPage.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Presets } from './pages/Presets/Presets.tsx';
import { Auth } from './pages/Auth/Auth.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Name } from './pages/Name/Name.tsx';

const googleClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

const router = createBrowserRouter([
	{
		path: '/character',
		children: [
			{
				path: ':id',
				element: <CharacterPage/>
			},
			{
				path: 'new',
				element: <Presets/>
			},
			{
				path: ':id/edit',
				element: <Presets/>
			}
		]
	},
	{
		path: '/auth',
		element: <Auth/>
	},
	{
		path: '/name',
		element: <Name/>
	},
	{
		path: '/characters',
		element: <Characters/>
	},
	{
		path: '*',
		element: <Navigate to='/characters' replace/>
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<GoogleOAuthProvider clientId={googleClientId}>
				<RouterProvider router={router} />	
			</GoogleOAuthProvider>
		</Provider>
	</React.StrictMode>
);
