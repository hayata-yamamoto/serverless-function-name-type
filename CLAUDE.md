# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI tool that generates Lambda function name types for Serverless Framework projects. It reads serverless.yml files and creates type-safe handler references in TypeScript or Python.

## Common Commands

- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm run format` - Format code with Prettier and ESLint 
- `npm run format:prettier` - Run Prettier formatting only
- `npm run format:lint` - Run ESLint with auto-fix
- `npm run lint` - Run ESLint (note: currently targets src/ but main code is in main.ts)

## Architecture

### Core Components

- **main.ts** - Main CLI entry point using Commander.js with strongly typed arguments
- **templates/** - Nunjucks templates for code generation:
  - `typescript.njk` - Generates TypeScript const object and type union
  - `python.njk` - Generates Python Enum class
- **generateCode()** - Core function that:
  1. Parses serverless.yml using js-yaml
  2. Extracts function names and applies stage prefixes
  3. Normalizes handler names (replaces hyphens with underscores)
  4. Renders appropriate template with Nunjucks

### CLI Interface

Command: `generate-handler-type <fp> <language> -o <output> [-s <stage>]`
- Supports TypeScript and Python output formats
- Optional stage parameter for environment-specific function names
- Function names follow pattern: `${service}-${stage}-${handlerName}` or `${service}-${handlerName}`

### Build System

- TypeScript compilation outputs to dist/ with declarations and source maps
- Single file architecture (main.ts includes all logic)
- Package published as `@hayata-yamamoto/serverless-function-name-type` with CLI binary `gen-sls-func-type`