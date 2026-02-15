// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import P5CrowDemo from './components/P5CrowDemo.vue'
import './custom.css'

export default {
	...DefaultTheme,
	enhanceApp({ app }: { app: any }) {
		app.component('P5CrowDemo', P5CrowDemo)
	}
}
