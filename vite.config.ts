import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate', // or 'prompt'
			devOptions: {
				enabled: true // Enable PWA in development
			},
			manifest: {
				name: 'Ширма',
				short_name: 'Ширма',
				description: 'Ещё совсем в альфе',
				theme_color: '#CEC2AE',
				icons: [
					{
						src: 'logo2.svg', // Ensure these icon files exist in your public directory
						sizes: '192x192',
						type: 'image/svg'
					},
					{
						src: 'logo2.svg',
						sizes: '512x512',
						type: 'image/svg'
					},
					{
						src: 'logo2.svg', // Optional: Maskable icon for adaptive icons
						sizes: '192x192',
						type: 'image/svg',
						purpose: 'maskable'
					}
				]
			}
		})]
});
