# serverless-function-name-type

[![npm version](https://badge.fury.io/js/%40hayata-yamamoto%2Fserverless-function-name-type.svg)](https://www.npmjs.com/package/@hayata-yamamoto/serverless-function-name-type)

Generate type-safe Lambda function name constants from your Serverless Framework configuration. Automatically creates TypeScript types or Python enums based on your `serverless.yml` file.

## Installation

```bash
npm install -g @hayata-yamamoto/serverless-function-name-type
```

## Usage

```bash
gen-sls-func-type <serverless.yml> <language> -o <output-file> [-s <stage>]
```

### Arguments

- `serverless.yml` - Path to your Serverless Framework configuration file
- `language` - Output language (`typescript` or `python`)
- `-o, --output <file>` - Output file path (required)
- `-s, --stage <stage>` - Deployment stage (optional, defaults to no stage)

### Examples

#### Generate TypeScript types

```bash
gen-sls-func-type serverless.yml typescript -o src/lambda-handlers.ts
```

Input `serverless.yml`:
```yaml
service: my-service

functions:
  user-handler:
    handler: handlers/user.handler
  api-gateway:
    handler: handlers/api.handler
  data-processor:
    handler: handlers/processor.handler
```

Generated TypeScript output:
```typescript
const lambdaHandlers = {
  user_handler: 'my-service-user-handler',
  api_gateway: 'my-service-api-gateway',
  data_processor: 'my-service-data-processor'
}
type LambdaHandler = keyof typeof lambdaHandlers
```

#### Generate Python enums

```bash
gen-sls-func-type serverless.yml python -o lambda_handlers.py
```

Generated Python output:
```python
from enum import Enum

class LambdaHandlers(str, Enum):
    user_handler = "my-service-user-handler"
    api_gateway = "my-service-api-gateway"
    data_processor = "my-service-data-processor"
```

#### With stage parameter

```bash
gen-sls-func-type serverless.yml typescript -o handlers.ts -s prod
```

Generated output with stage:
```typescript
const lambdaHandlers = {
  user_handler: 'my-service-prod-user-handler',
  api_gateway: 'my-service-prod-api-gateway',
  data_processor: 'my-service-prod-data-processor'
}
type LambdaHandler = keyof typeof lambdaHandlers
```

## Use Cases

- **Type safety**: Get compile-time checks when referencing Lambda function names
- **Refactoring**: Safely rename functions across your codebase
- **Cross-service communication**: Invoke Lambda functions with confidence
- **Testing**: Mock function names consistently
- **Documentation**: Auto-generated reference of all function names

## How It Works

1. Parses your `serverless.yml` file
2. Extracts function names from the `functions` section
3. Applies naming convention: `${service}-${stage}-${functionName}` (or `${service}-${functionName}` without stage)
4. Normalizes function names (replaces hyphens with underscores for valid identifiers)
5. Generates type-safe constants using Nunjucks templates

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## License

MIT

