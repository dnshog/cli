#!/usr/bin/env node

import { ZodError } from 'zod';
import { defineConfig, defineCommand, processConfig } from '@robingenz/zli';
import { log } from '@clack/prompts';

const infoCommand = defineCommand({
  description: 'Show information',
  action: async () => {
    log.info(`DNSHog CLI - Version ${process.env.npm_package_version}`);
  },
});

// Configure the CLI
const config = defineConfig({
  meta: {
    name: 'dnshog',
    version: process.env.npm_package_version,
    description: 'DNSHog CLI',
  },
  commands: {
    info: infoCommand,
    ping: await import('./commands/ping.js').then((mod) => mod.default),
  },
  defaultCommand: infoCommand
});

// Process command line arguments
try {
  const result = processConfig(config, process.argv.slice(2));
  await result.command.action(result.options, result.args);
} catch (error) {
  if (error instanceof ZodError) {
    error.issues.forEach((issue) => {
      log.error(`- [${issue.path.join('.')}] ${issue.message}`);
    });
  } else {
    log.error(`An unexpected error occurred: ${error}`);
  }
  process.exit(1);
}