import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import '../fonts/styles.css';
import { Characters } from './pages/Characters/Characters.tsx';
import { CharacterPage } from './pages/CharacterPage/CharacterPage.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { Presets } from './pages/Presets/Presets.tsx';

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
			}
		]
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
			<RouterProvider router={router} />	
		</Provider>
	</React.StrictMode>
);
