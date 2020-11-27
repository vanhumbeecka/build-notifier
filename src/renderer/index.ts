import { library } from '@fortawesome/fontawesome-svg-core'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faCalendar, faClock, faCodeBranch, faGlobe, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as Sentry from '@sentry/electron'
import { Vue as VueIntegration } from '@sentry/integrations'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/tooltip'
import ElementUI from 'element-ui'
// @ts-ignore
import enLocale from 'element-ui/lib/locale/lang/en'
import Vue from 'vue'

import ECharts from 'vue-echarts'

import App from './App.vue'
import router from './router'
import './router/triggers'
import store from './store'
import './styles/base.scss'
import './styles/element-variables.scss'

Vue.component('v-chart', ECharts)


Vue.use(ElementUI, {locale: enLocale})

library.add(faCodeBranch, faClock, faTag, faCalendar, faTwitter, faGlobe)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue.component(Button.name, Button);
// Vue.component(Select.name, Select);
// Vue.component(Header.name, Header);
// Vue.component(Container.name, Container);
// Vue.component(Main.name, Main);
// Vue.component(Row.name, Row);
// Vue.component(Menu.name, Menu);
// Vue.component(MenuItem.name, MenuItem);
// Vue.component(Table.name, Table);
// Vue.component(TableColumn.name, TableColumn);
// Vue.component(Radio.name, Radio);

const isDevelopment = process.env.NODE_ENV !== 'production'

Vue.config.devtools = isDevelopment
Vue.config.productionTip = false


if (!isDevelopment) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    maxBreadcrumbs: 50,
    integrations: [new VueIntegration({Vue, attachProps: true})]
  })
}

new Vue({
  router, store, render: (h) => h(App)
}).$mount('#app')


