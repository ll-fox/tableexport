// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
const withAntdLess = require('next-plugin-antd-less')

module.exports = withAntdLess({
  // 修改antd的主题变量
  reactStrictMode: true,
  modifyVars: { '@primary-color': '#c49b45' }, // 修改antd的primary颜色为黑色
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},
  webpack(config) {
    return config
  }
})