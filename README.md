# interactive-embed-uploader

`interactive-embed-uploader` exposes a single POST endpoint, `/embed-uploader`, which takes a `type` query parameter. The `type` must match one of the types listed in [gu.json](https://github.com/guardian/interactive-embed-uploader/blob/master/gu.json):

``` 
"types": {
        "map": {
            "s3basepath": "maps/embed"
        },
        "chart": {
            "s3basepath": "charts/embed"
        },
        "street": {
            "s3basepath": "streets/embed"
        }
    }
```

The body of the POST should include an `embed` value, containing the HTML to be converted into an embed.

Assuming an embed can be created, the file is uploaded to the S3 bucket `gdn-cdn`. Depending on the `type` value, the embed will be uploaded to one of three directories (as listed in [gu.json](https://github.com/guardian/interactive-embed-uploader/blob/master/gu.json)) and the POST request will return a URL link to the successfully uploaded embed.

# Installation
```
npm install
```

# Running
```
npm start
```
