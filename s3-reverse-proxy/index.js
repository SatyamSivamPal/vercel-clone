const express = require('express')
const httpProxy = require('http-proxy')

const app = express();
const PORT = 8000
const BASE_PATH = 'https://vercel-clone-satyam.s3.amazonaws.com/__outputs'


const proxy = httpProxy.createProxyServer({});

app.get('/' , (req, res) => {
    res.send('Hello Satyam :)')
})

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    const resolveTo = `${BASE_PATH}/${subdomain}`

    proxy.web(req, res, { target: resolveTo, changeOrigin: true }, (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error occurred.');
    });
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;

    if(url === '/' )
    {
        proxyReq.path += 'index.html';
    }
})

app.listen(PORT, () => console.log(`Reverse Proxy is runnig ... ${PORT}`))
