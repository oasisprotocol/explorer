// TODO: remove this when API adds CORS
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/proxy-api', {
      target: 'https://index.oasislabs.com/v1/',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy-api': '',
      },
    })
  )
}
