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
		// add the theme options to the toolbar
		// the class and color prop doesnt seem to do anything in this setup, probably because i disabled backgrounds
		themes: {
			default: 'system',
			list: [{ name: 'system' }, { name: 'light' }, { name: 'dark' }],
		},
		// https://github.com/storybookjs/storybook/discussions/25183#discussioncomment-9646359
		// disable as it conflicts with themes
		backgrounds: { disable: true },
	},
}

// actually apply the themes
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
