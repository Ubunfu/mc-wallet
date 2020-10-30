# mc-wallet
[![Latest Release](https://img.shields.io/github/v/release/Ubunfu/mc-wallet)](https://github.com/Ubunfu/mc-wallet/releases)
[![codecov](https://codecov.io/gh/Ubunfu/mc-wallet/branch/master/graph/badge.svg?token=258GHULYE1)](https://codecov.io/gh/Ubunfu/mc-wallet)
[![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/mc-wallet?logo=circleci)](https://app.circleci.com/pipelines/github/Ubunfu/mc-wallet)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/mc-wallet?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/mc-wallet)

Processes requests for payments and charges to user wallets submitted by [mc-bounty-processor](https://github.com/Ubunfu/mc-bounty-processor) 

This service runs as an AWS lambda function.

## Configuration
### IAM Role
AWS's standard IAM role for Lambda micro services is plenty sufficient. The only access that is required is read/write for DynamoDB, and write to CloudWatch logs.

* AWSLambdaMicroserviceExecutionRole
* AWSLambdaBasicExecutionRole

### Environment Variables
| Parameter          | Description                                                                       | Default | Required? |
|--------------------|-----------------------------------------------------------------------------------|---------|-----------|
| TABLE_WALLETS      | The name of a DynamoDB table containing user wallets.                             | n/a     | Yes       |
| LOGGER_ENABLED     | Boolean value controlling writing of logs. Useful to turn off for test execution. | n/a     | Yes       |