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

# References

- Project based on [Serverless v3 _aws-node-http-api-typescript_ template](https://github.com/serverless/examples/aws-node-http-api-typescript)
