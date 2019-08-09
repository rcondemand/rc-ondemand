#!/usr/bin/env node

'use strict'

const fs = require('fs')
const path = require('path')
const sh = require('shelljs')

sh.config.fatal = true

function regExpQuote(string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function regExpQuoteReplacement(string) {
  return string.replace(/[$]/g, '$$')
}

const DRY_RUN = false

function walkAsync(directory, excludedDirectories, fileCallback, errback) {
  if (excludedDirectories.has(path.parse(directory).base)) {
    return
  }
  fs.readdir(directory, (err, names) => {
    if (err) {
      errback(err)
      return
    }
    names.forEach((name) => {
      const filepath = path.join(directory, name)
      fs.lstat(filepath, (err, stats) => {
        if (err) {
          process.nextTick(errback, err)
          return
        }
        if (stats.isDirectory()) {
          process.nextTick(walkAsync, filepath, excludedDirectories, fileCallback, errback)
        } else if (stats.isFile()) {
          process.nextTick(fileCallback, filepath)
        }
      })
    })
  })
}

function replaceRecursively(directory, excludedDirectories, allowedExtensions, original, replacement) {
  original = new RegExp(regExpQuote(original), 'g')
  replacement = regExpQuoteReplacement(replacement)
  const updateFile = DRY_RUN ? (filepath) => {
    if (allowedExtensions.has(path.parse(filepath).ext)) {
      console.log(`FILE: ${filepath}`)
    } else {
      console.log(`EXCLUDED:${filepath}`)
    }
  } : (filepath) => {
    if (allowedExtensions.has(path.parse(filepath).ext)) {
      sh.sed('-i', original, replacement, filepath)
    }
  }
  walkAsync(directory, excludedDirectories, updateFile, (err) => {
    console.error(err)
    process.exit(1)
  })
}

function main(args) {
  if (args.length !== 2) {
    console.error('Got arguments:', args)
    process.exit(1)
  }
  const oldVersion = args[0]
  const newVersion = args[1]
  const EXCLUDED_DIRS = new Set([
    '.git',
    'node_modules',
    'vendor'
  ])
  const INCLUDED_EXTENSIONS = new Set([
    '',
    '.css',
    '.html',
    '.js',
    '.json',
    '.md',
    '.scss',
    '.txt',
    '.yml'
  ])
  replaceRecursively('.', EXCLUDED_DIRS, INCLUDED_EXTENSIONS, oldVersion, newVersion)
}

main(process.argv.slice(2))
