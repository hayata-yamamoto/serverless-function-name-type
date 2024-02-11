import { Command, Argument } from 'commander'
import { load } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'
import nunjucks from 'nunjucks'

const version = '0.0.1'

const languages = {
  typescript: 'typescript',
  python: 'python'
}
type Language = keyof typeof languages
const languageTemplates = {
  typescript: './templates/typescript-template.tmpl',
  python: './templates/python-template.tmpl'
}

type EventType = {
  http: {
    method: string
    path: string
  }
}
type FunctionType = Record<string, {
  handler: string
  events: EventType[]
}>
type ServerlessYamlType = {
  service: string
  provider: {
    name: string
    runtime: string
  }
  functions: FunctionType
}

type GenerateCodeVariables = {
  fp: string
  outputFp: string
  language: Language
  stage: string
}
const generateCode = (variables: GenerateCodeVariables): void => {
  const { fp, language, stage, outputFp } = variables
  const config = load(readFileSync(fp, 'utf8')) as ServerlessYamlType
  const service = config.service

  let handlers = {}
  for (const [handlerSuffix, _] of Object.entries(config.functions)) {
    if (stage !== '') {
      handlers = {
        ...handlers,
        [handlerSuffix.replace(/-/g, '_')]: `${service}-${stage}-${handlerSuffix}`
      }
    } else {
      handlers = {
        ...handlers,
        [handlerSuffix.replace(/-/g, '_')]: `${service}-${handlerSuffix}`
      }
    }
  }

  switch (language) {
    case languages.typescript:
      break
    case languages.python:
      writeFileSync(outputFp, nunjucks.render(languageTemplates.python, { handlers }) as string)
      break
    default:
      throw new Error('Unsupported language')
  }
}

const program = new Command()
program
  .version(version)
  .command('generate')
  .argument('fp', 'serverless yaml file path')
  .addArgument(
    new Argument('<language>', 'language to generate').choices(
      Object.keys(languages)
    )
  )
  .requiredOption('-o, --output <output>', 'output directory')
  .option('-s, --stage <stage>', 'stage to generate', '')
  .action((fp: string, language: Language, option) => {
    generateCode({ fp, language, stage: option.stage, outputFp: option.output})
  })
  .parse()
