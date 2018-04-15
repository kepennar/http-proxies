# http-proxies

## Simple configurable http proxy server

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

```
  Usage: index [options]

  Options:

    -V, --version      output the version number
    -c, --conf <path>  Config file defaults to ./proxies-conf.json
    -p, --port [path]  Http proxy server port. Default to 8080
    -l, --logs         With access log
    -s, --secure       With SSL (Auto generated self signed certificate)
    -h, --help         output usage information
  Examples:

    $ http-proxies --help
    $ http-proxies -c your-proxies-conf.json
    $ http-proxies -c your-proxies-conf.json -ls
```
