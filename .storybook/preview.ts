import type { Preview } from '@storybook/sveltekit'
import { withThemeByClassName } from '@storybook/addon-themes'
import './storybook.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		themes: {
			default: 'system',
			list: [
				{ name: 'system', class: '', color: '#ffffff' },
				{ name: 'light', class: '', color: '#ffffff' },
				{ name: 'dark', class: 'dark bg-neutral-900', color: '#000000' },
			],
		},
		backgrounds: { disable: true },
	},
}

export const decorators = [
	withThemeByClassName({
		themes: {
			system: '',
			light: '',
			dark: 'dark bg-neutral-900',
		},
		defaultTheme: 'system',
		parentSelector: 'html',
	}),
]

export default preview
