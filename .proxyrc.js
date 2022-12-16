// TODO: remove this when API adds CORS
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('dotenv').config({ path: `.env` })
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/proxy-api', {
      target: process.env.REACT_APP_API_PROXY_TARGET,
      changeOrigin: true,
      pathRewrite: {
        '^/proxy-api': '',
      },
    })
  )
}
