import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(async ({ mode }) => {
	const isDev = mode === 'development'
	const frappeui = await importFrappeUIPlugin(isDev)

	const config = {
		define: {
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
		},
		plugins: [
			frappeui({
				frappeProxy: true,
				lucideIcons: true,
				jinjaBootData: true,
				buildConfig: {
					indexHtmlPath: '../lms/www/lms.html',
				},
			}),
			vue({
				script: {
					defineModel: true,
					propsDestructure: true,
				},
			}),
			VitePWA({
				registerType: 'autoUpdate',
				devOptions: {
					enabled: true,
				},
				workbox: {
					cleanupOutdatedCaches: true,
					maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
					globDirectory: '/assets/lms/frontend',
					globPatterns: ['**/*.{js,ts,css,html,png,svg}'],
					runtimeCaching: [
						{
							urlPattern: ({ request }) =>
								request.destination === 'document',
							handler: 'NetworkFirst',
							options: {
								cacheName: 'html-cache',
							},
						},
					],
				},
				manifest: {
					display: 'standalone',
					name: 'Learning',
					short_name: 'Learning',
					start_url: '/lms',
					description:
						'Easy to use, 100% open source Learning Management System',
					theme_color: '#0f7159',
					background_color: '#ffffff',
					icons: [
						{
							src: '/assets/lms/frontend/manifest/manifest-icon-192.maskable.png',
							sizes: '192x192',
							type: 'image/png',
							purpose: 'maskable any',
						},
						{
							src: '/assets/lms/frontend/manifest/manifest-icon-512.maskable.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable any',
						},
					],
				},
			}),
		],
		server: {
			host: '0.0.0.0', // Accept connections from any network interface
			allowedHosts: ['ps', 'fs'], // Explicitly allow this host
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
			},
		},
		optimizeDeps: {
			include: [
				'feather-icons',
				'showdown',
				'engine.io-client',
				'tailwind.config.js',
				'interactjs',
				'highlight.js',
				'plyr',
			],
			exclude: mode === 'production' ? [] : ['frappe-ui'],
		},
	}
	return config
})

async function importFrappeUIPlugin(isDev) {
	if (isDev) {
		try {
			const module = await import('../frappe-ui/vite')
			return module.default
		} catch (error) {
			console.warn(
				'Local frappe-ui not found, falling back to npm package:',
				error.message
			)
		}
	}
	// Fall back to npm package if local import fails
	const module = await import('frappe-ui/vite')
	return module.default
}
