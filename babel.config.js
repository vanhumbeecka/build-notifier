const presets = [
  ["es2015", { "modules": false }]
];
const plugins = [
  [
    "component",
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }
  ]
];

module.exports = { presets, plugins };
