const express = require('express')
const httpProxy = require('http-proxy')

const app = express();
const PORT = 8000
const BASE_PATH = 'https://vercel-clone-satyam.s3.amazonaws.com/__outputs'

const proxy = httpProxy.createProxy();

app.get('/' , (req, res) => {
    res.send('Hello-world')
})

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    const resolveTo = `${BASE_PATH}/${subdomain}`
    return proxy.web(req, res, {target: resolveTo, changeOrigin: true })
})

app.listen(PORT, () => console.log(`Reverse Proxy is runnig ... ${PORT}`))
