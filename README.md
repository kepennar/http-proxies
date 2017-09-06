# http-proxies

## Simple configurable http proxy server

### Example
```bash
$ npx http-proxies -c conf.json
```

conf.json
```json
[
  {
    "context": ["/v1/auth"],
    "target": "http://localhost:1234",
    "secure": false,
    "pathRewrite": {
      "^/v1/auth": "/auth"
    }
  },
  {
    "context": ["/v1/marketplace"],
    "target": "http://localhost:8888",
    "secure": false,
    "pathRewrite": {
      "^/v1/marketplace": "/marketplace"
    }
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
    -h, --help         output usage information
  Examples:

    $ http-proxies --help
    $ http-proxies -c your-proxies-conf.json


```