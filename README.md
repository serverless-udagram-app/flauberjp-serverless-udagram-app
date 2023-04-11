# Serverless Udagram app

This app server images from users like instagram. It is built using serverless technologies.

## Setup

Run this command to initialize a new project in a new working directory.

```
npm install
```

## Usage

**Deploy**

```
$ serverless deploy
```

**Invoke the function locally.**

```
serverless invoke local --function hello
```

**Invoke the function**

```
curl https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/
```

# Troubleshoot

- [Request validation using serverless framework](https://stackoverflow.com/a/56332035)
  - [Serverless Request Schema Validators](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/#request-schema-validators)
- [Referencing websocket api id in serverless template](https://repost.aws/questions/QUEO4tL0J6SvyLWeSAB2cv6g/referencing-websocket-api-id-in-serverless-template)
  - _Ref: 'WebsocketsApi'_
- [Unable to write text to S3 bucket](https://stackoverflow.com/a/58614241/6771132)
  > var params = {
        Bucket: 'bucket-write-logs-to',
        Key: 'example2.txt',
        Body: Buffer.from(JSON.stringify(event), 'utf8')
        };
  var x = await s3.putObject(params).promise();
- [Cannot use import statement outside a module in Lambda function](https://stackoverflow.com/a/61780186/6771132)
  > const uuid = require('uuid'); // <-- how to import
- [Error getting DynamoDb local latest tar.gz location undefined: 403](https://github.com/99x/serverless-dynamodb-local/issues/294#issuecomment-1462496399)
- [DynamoDB Local is not available for stage: dev](https://github.com/99x/serverless-dynamodb-local/issues/225#issuecomment-498023248)

# References

- Project based on [Serverless v3 _aws-node-http-api-typescript_ template](https://github.com/serverless/examples/tree/v3/aws-node-http-api-typescript)
  > serverless create --template-url https://github.com/serverless/examples/tree/v3/aws-node-http-api-typescript
