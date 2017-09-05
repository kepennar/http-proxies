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