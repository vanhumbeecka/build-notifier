import {NormalModuleReplacementPlugin} from 'webpack'

module.exports = {
  // ... your other options
  transpileDependencies: [
    'vuex-module-decorators',
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    plugins: [
      new NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
    ]
  }

}
