// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import P5CrowDemo from './components/P5CrowDemo.vue'
import Layout from './components/Layout.vue'
import './custom.css'

export default {
	...DefaultTheme,
	Layout,
	enhanceApp({ app }: { app: any }) {
		app.component('P5CrowDemo', P5CrowDemo)
	}
}
