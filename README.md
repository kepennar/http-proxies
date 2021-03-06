# http-proxies

![HTTP-pROXies logo](./doc/logo.png?raw=true "Logo")

## Simple configurable http proxy server

[![Build Status](https://travis-ci.org/kepennar/http-proxies.svg?branch=master)](https://travis-ci.org/kepennar/http-proxies)

### Example

```bash
npx http-proxies -c conf.json
```

conf.json

```json
[
  {
    "context": ["/google"],
    "target": "https://www.google.com",
    "secure": false,
    "autoRewrite": true,
    "pathRewrite": {
      "^/google": "/"
    },
    "rewriteHeaders": {
      "Host": "example.com"
    },
    "cookieDomainRewrite": { "*": "" }
  },
  {
    "context": ["/v1/app1"],
    "target": "http://localhost:1234",
    "secure": false,
    "pathRewrite": {
      "^/v1/app1": "/app1"
    }
  },
  {
    "context": ["/app2"],
    "target": "http://localhost:4001",
    "secure": false,
    "changeOrigin": true,
    "enforceAutoRewrite": true
  }
]

```

### Help

```bash
  Usage: index [options]

  Options:

    -V, --version      output the version number
    -c, --conf <path>  Config file defaults to ./proxies-conf.json
    -p, --port [path]  Http proxy server port. Default to 8080
    -l, --logs         With access log
    -s, --secure       With SSL (Auto generated self signed certificate)
    -m, --managment    Enable managment
    -h, --help         output usage information
  Examples:

    $ http-proxies --help
    $ http-proxies -c your-proxies-conf.json
    $ http-proxies -c your-proxies-conf.json -lsm
```

### Management UI

Start with the `-m` option an go to `http(s)://localhost:_your_proxy_port/management`
And you'll get this beautiful management UI

![Management UI screen](./doc/management-screen.png?raw=true "Screen")
