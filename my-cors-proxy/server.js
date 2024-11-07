const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/', createProxyMiddleware({
    target: 'https://ndmcbd.com',
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '/json/archive/json', // Rewrite "/proxy" to match the JSON path
    },
}));

app.listen(8080, () => {
    console.log('CORS proxy server running on http://localhost:8080');
});
