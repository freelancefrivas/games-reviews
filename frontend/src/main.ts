import './assets/styles/main.css'

import {createApp, reactive} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
//SAKAI
import Tooltip from 'primevue/tooltip'
//import CodeHighlight from '@/directive/AppCodeHighlight'
import StyleClass from 'primevue/styleclass'
import BadgeDirective from 'primevue/badgedirective'
//import AppWrapperVue from './layout/AppWrapper.vue'
import Ripple from 'primevue/ripple';
import SelectButton from 'primevue/selectbutton'



import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {theme: {preset: Aura}});
app.mount('#app')
